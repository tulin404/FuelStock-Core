import type { Delta, MappedStockProduct } from "../types/types.js";
import { Prisma, PrismaClient, StockMovementType } from "../generated/prisma/client.js";
import { parseStockXls } from "../utils/xls.parser.js";
import normalizeProduct from "../utils/normalizeProduct.js";

export default class StockService {
    readonly #prisma: PrismaClient;
    readonly #prismaStatic: typeof Prisma

    constructor(prisma: PrismaClient, prismaStatic: typeof Prisma) {
        this.#prisma = prisma;
        this.#prismaStatic = prismaStatic;
    };

    async #createProductsMap(tenant_id: string, tx: Prisma.TransactionClient) {
        const productsMap = new Map<string, string>();

        const products = await tx.products.findMany({
            where: { tenant_id },
            select: { id: true, name: true }
        });

        for (const product of products) {
            const key = normalizeProduct(product.name);
            productsMap.set(key, product.id);
        };

        return productsMap;
    };

    async #calculateProductsDelta(tenant_id: string) {
        const todayBR = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

        const result: Delta[] = await this.#prisma.$queryRawUnsafe(`
            SELECT 
                ps.product_id,
                ps.import_id,
                (ps.last_cumulative_cost / ps.last_cumulative_qty) AS unit_cost,
                (t.cumulative_qty - COALESCE(y.cumulative_qty, 0)) AS delta
            FROM processed_snapshots ps
            JOIN product_daily_sales t
              ON t.product_id = ps.product_id
              AND t.tenant_id = ps.tenant_id
              AND t.date = $2
            LEFT JOIN product_daily_sales y
              ON y.product_id = ps.product_id
              AND y.tenant_id = ps.tenant_id
              AND y.date = (($2::date - INTERVAL '1 day')::text)
            WHERE ps.tenant_id = $1::uuid;
        `, tenant_id, todayBR);

        const filtered = result.filter(product => product.delta > 0);
        return filtered;
    };

    async syncStock(tenant_id: string) {
        const deltas = await this.#calculateProductsDelta(tenant_id);

        const sales = deltas.map(product => ({
            id: crypto.randomUUID(),
            import_id: product.import_id,
            tenant_id,
            product_id: product.product_id,
            type: "SALE" as StockMovementType,
            quantity: product.delta,
            unit_cost: product.unit_cost,
        }));

        const updateData = deltas.map(product =>
            this.#prismaStatic.sql`(
                ${product.product_id}::uuid,
                ${product.delta}
            )`
        );

        // ATOMICITY AND PERFORMANCE
        await this.#prisma.$transaction(async (tx) => {
            await tx.stock_movements.createMany({
                data: sales
            });

            await tx.$executeRaw`
                UPDATE stocks 
                SET current_stock = 
                    stocks.current_stock - values_table.quantity
                FROM (
                    VALUES ${this.#prismaStatic.join(updateData)}                
                ) AS values_table(product_id, quantity)
                WHERE
                    stocks.product_id = values_table.product_id
                    AND stocks.tenant_id = ${tenant_id}::uuid
            `;
        });
    };

    async addManualStock(tenant_id: string, stocks: MappedStockProduct[]) {

        if (stocks.length === 0) {
            throw new Error("Stocks vazios");
        };

        await this.#prisma.$transaction(async(tx) => {

            const productsData = stocks.map(stock =>
                this.#prismaStatic.sql`(
                    ${crypto.randomUUID()}::uuid,
                    ${tenant_id}::uuid,
                    ${stock.name},
                    ${stock.category}
                )`
            );

                
            // SYNC PRODUCTS
            await tx.$executeRaw`
                INSERT INTO products (
                    id,
                    tenant_id,
                    name,
                    category
                )
                VALUES ${this.#prismaStatic.join(productsData)}
                ON CONFLICT (tenant_id, name)
                DO UPDATE SET
                    category = EXCLUDED.category
            `;


            const productsMap = await this.#createProductsMap(tenant_id, tx);

            // ADD STOCK
            const stocksData = stocks.map(stock => {
                const product_id = productsMap.get(normalizeProduct(stock.name));

                if (!product_id) {
                    throw new Error(`Produto inválido inserido na planilha: ${stock.name}`);
                };

                return this.#prismaStatic.sql`(
                    ${product_id}::uuid,
                    ${tenant_id}::uuid,
                    ${stock.quantity}
                )`;
            });

            await tx.$executeRaw`
                INSERT INTO stocks(
                    product_id,
                    tenant_id,
                    current_stock
                )
                VALUES ${this.#prismaStatic.join(stocksData)}
                ON CONFLICT (product_id, tenant_id)
                DO UPDATE SET
                    current_stock = EXCLUDED.current_stock   
            `;
        });
    };
};