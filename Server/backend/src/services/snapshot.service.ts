import type { Prisma, PrismaClient } from "../generated/prisma/client.js";
import type { product_daily_salesCreateManyInput } from "../generated/prisma/models.js";
import type { MappedDailyProduct } from "../types/types.js";
import { formatter } from "../utils/date.formatter.js";
import normalizeProduct from "../utils/normalizeProduct.js";

// NOTE!
// CASTING AND SQL ARE BEING DONE INSIDE THE RAW QUERIES FOR MEMORY REASONS
// AND ARRAYS ARE BEING USE INSTEAD OF OBJECTS FOR PERFORMANCE

export class SnapshotService {
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
        const snapshots: any[][] = [];
        const daily: product_daily_salesCreateManyInput[] = [];
        const todayBR = formatter.format(new Date());
        
        for (const row of productData) {
            const key = normalizeProduct(row.productName);
            const product_id = productsMap.get(key);
            if (!product_id) {
                console.warn("Unknow product:", row.productName);
                continue; // skip iteration
            };
            
            snapshots.push([
                tenant_id,
                product_id,
                import_id,
                todayBR,
                row.unitCost,
                row.unitProfitMargin,
                row.totalSoldQty,
                row.totalRevenue,
                row.totalCost,
                row.totalProfit
            ]);
            
            daily.push({
                id: crypto.randomUUID(),
                tenant_id,
                product_id,
                import_id,
                date: todayBR,
                unit_cost: row.unitCost,
                unit_profit_margin: row.unitProfitMargin,
                cumulative_qty: row.totalSoldQty,
                cumulative_revenue: row.totalRevenue,
                cumulative_cost: row.totalCost,
                cumulative_profit: row.totalProfit
            });
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
                    last_unit_cost,
                    last_unit_profit_margin,
                    last_cumulative_qty,
                    last_cumulative_revenue,
                    last_cumulative_cost,
                    last_cumulative_profit
                )
                VALUES ${this.#prismaStatic.join(snapshots.map(row => this.#prismaStatic.sql`(
                    ${row[0]}::uuid,
                    ${row[1]}::uuid,
                    ${row[2]}::uuid,
                    ${row[3]},
                    ${row[4]},
                    ${row[5]},
                    ${row[6]},
                    ${row[7]},
                    ${row[8]},
                    ${row[9]}
                )`))}
                ON CONFLICT (tenant_id, product_id)
                DO UPDATE SET
                    last_date = EXCLUDED.last_date,
                    last_unit_cost = EXCLUDED.last_unit_cost,
                    last_unit_profit_margin = EXCLUDED.last_unit_profit_margin,
                    last_cumulative_qty = EXCLUDED.last_cumulative_qty,
                    last_cumulative_revenue = EXCLUDED.last_cumulative_revenue,
                    last_cumulative_cost = EXCLUDED.last_cumulative_cost,
                    last_cumulative_profit = EXCLUDED.last_cumulative_profit,
                    updated_at = now();
            `;

            // DAILY SALES
            await tx.product_daily_sales.createMany({ data: daily });
        });
    };
};