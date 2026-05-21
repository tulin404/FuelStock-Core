import type { Prisma, PrismaClient } from "../generated/prisma/client.js";
import type { MappedDailyProduct } from "../types/types.js";
import normalizeProduct from "../utils/normalizeProduct.js";

export default class SnapshotService {
    readonly #prisma: PrismaClient;
    readonly #prismaStatic: typeof Prisma;
    
    constructor(prisma: PrismaClient, prismaStatic: typeof Prisma) {
        this.#prisma = prisma;
        this.#prismaStatic = prismaStatic;
    };

    async #createProductsMap(tenant_id: string) {
        const productsMap = new Map<string, string>();

        const products = await this.#prisma.products.findMany({
            where: { tenant_id },
            select: { id: true, name: true }
        });

        for (const product of products) {
            const key = normalizeProduct(product.name);
            productsMap.set(key, product.id);
        };

        return productsMap;
    };

    getLastSnapshots(tenant_id: string) {
        return this.#prisma.processed_snapshots.findMany({
            where: { tenant_id },
            select: { product_id: true, import_id: true, last_cumulative_qty: true, last_cumulative_cost: true }
        });
    };

    async createSnapshotAndDaily(import_id: string, tenant_id: string, productData: MappedDailyProduct[]) {
        // DOING BOTH SNAPSHOT AND DAILY TO SAVE PROCESSING POWER AND DB WRITES/READS
        
        const productsMap = await this.#createProductsMap(tenant_id);
        const snapshots: Prisma.Sql[] = [];
        const daily: Prisma.Sql[] = [];
        const todayBR = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());
        
        for (const row of productData) {
            const key = normalizeProduct(row.productName);
            const product_id = productsMap.get(key);
            if (!product_id) {
                console.warn("Unknow product:", row.productName);
                continue; // skip iteration
            };
            snapshots.push(this.#prismaStatic.sql`(
                ${tenant_id}::uuid,
                ${product_id}::uuid,
                ${import_id}::uuid,
                ${todayBR},
                ${row.totalSoldQty},
                ${row.totalRevenue},
                ${row.totalCost},
                ${row.totalProfit}
            )`);
            daily.push(this.#prismaStatic.sql`(
                ${crypto.randomUUID()}::uuid,
                ${tenant_id}::uuid,
                ${product_id}::uuid,
                ${import_id}::uuid,
                ${todayBR},
                ${row.totalSoldQty},
                ${row.totalRevenue},
                ${row.totalCost},
                ${row.totalProfit}
            )`);
        };
        
        // ATOMICITY
        await this.#prisma.$transaction(async(tx) => {
            // SNAPSHOTS
            await tx.$executeRaw`
                INSERT INTO processed_snapshots (
                    tenant_id,
                    product_id,
                    import_id,
                    last_date,
                    last_cumulative_qty,
                    last_cumulative_revenue,
                    last_cumulative_cost,
                    last_cumulative_profit
                )
                VALUES ${this.#prismaStatic.join(snapshots)}
                ON CONFLICT (tenant_id, product_id)
                DO UPDATE SET
                    last_date = EXCLUDED.last_date,
                    last_cumulative_qty = EXCLUDED.last_cumulative_qty,
                    last_cumulative_revenue = EXCLUDED.last_cumulative_revenue,
                    last_cumulative_cost = EXCLUDED.last_cumulative_cost,
                    last_cumulative_profit = EXCLUDED.last_cumulative_profit,
                    updated_at = now();
            `;

            // DAILY SALES
            await tx.$executeRaw`
                INSERT INTO product_daily_sales (
                    id,
                    tenant_id,
                    product_id,
                    import_id,
                    date,
                    cumulative_qty,
                    cumulative_revenue,
                    cumulative_cost,
                    cumulative_profit
                )
                VALUES ${this.#prismaStatic.join(daily)}
            `;
        });
    };
};