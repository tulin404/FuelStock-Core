import type { Delta, MappedStockProduct } from "../types/types.js";
import { Prisma, PrismaClient, StockMovementType } from "../generated/prisma/client.js";
import normalizeProduct from "../utils/normalizeProduct.js";
import type { StockProduct } from "../types/types.js";
import { formatter } from "../utils/date.formatter.js";

// NOTE!
// CASTING AND SQL ARE BEING DONE INSIDE THE RAW QUERIES FOR MEMORY REASONS
// AND ARRAYS ARE BEING USE INSTEAD OF OBJECTS FOR PERFORMANCE

export class StockService {
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

    async #createCurrentStocksMap(tenant_id: string, tx: Prisma.TransactionClient) {
        const currentStocksMap = new Map<string, number>();
        
        const currentStocks = await tx.stocks.findMany({ 
            where: { tenant_id }
        });

        for (const currentStock of currentStocks) {
            currentStocksMap.set(currentStock.product_id, currentStock.current_stock.toNumber());
        };
        
        return currentStocksMap;
    };

    async #calculateProductsDelta(tenant_id: string) {
        const todayBR = formatter.format(new Date());

        // POSSIBLE BREAK (RAW UNSAFE CHANGED TO SAFE)
        const result: Delta[] = await this.#prisma.$queryRaw`
            SELECT 
                ps.product_id,
                ps.import_id,
                ps.last_unit_cost AS unit_cost,
                (t.cumulative_qty - COALESCE(y.cumulative_qty, 0)) AS delta
            FROM processed_snapshots ps
            JOIN product_daily_sales t
              ON t.product_id = ps.product_id
              AND t.tenant_id = ps.tenant_id
              AND t.date = ${todayBR}
            LEFT JOIN product_daily_sales y
              ON y.product_id = ps.product_id
              AND y.tenant_id = ps.tenant_id
              AND y.date = ((${todayBR}::date - INTERVAL '1 day')::text)
            WHERE ps.tenant_id = ${tenant_id}::uuid;
        `;

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

        const updateData = deltas.map(product => [
            product.product_id,
            product.delta
        ]);

        // ATOMICITY AND PERFORMANCE
        await this.#prisma.$transaction(async (tx) => {
            await tx.stock_movements.createMany({
                data: sales
            });

            await tx.$executeRaw`
                UPDATE stocks
                SET current_stock = GREATEST(
                    stocks.current_stock - values_table.quantity,
                    0
                )
                FROM (
                    VALUES ${this.#prismaStatic.join(updateData.map(row => this.#prismaStatic.sql`(
                        ${row[0]}::uuid,
                        ${row[1]}
                    )`))}
                ) AS values_table(product_id, quantity)
                WHERE
                    stocks.product_id = values_table.product_id
                    AND stocks.tenant_id = ${tenant_id}::uuid
            `;
        });
    };

    async addAjustment(tenant_id: string, productsList: StockProduct[]) {

        const filtered = productsList.filter(product => product.change !== 0);
        
        const movementsNewData = filtered.map(product => ({
            id: crypto.randomUUID(),
            import_id: null,
            tenant_id,
            product_id: product.id,
            type: "ADJUSTMENT" as StockMovementType,
            quantity: Number(product.change),
            unit_cost: null
        }));

        const stocksNewData = filtered.map(product => [
            product.id,
            tenant_id,
            product.newStock
        ]);

        await this.#prisma.$transaction(async(tx) => {

            await tx.stock_movements.createMany({
                data: movementsNewData
            });

            await tx.$executeRaw`
                UPDATE stocks
                SET current_stock = values_table.new_stock
                FROM (
                    VALUES ${this.#prismaStatic.join(stocksNewData.map(row => this.#prismaStatic.sql`(
                        ${row[0]}::uuid,
                        ${row[1]}::uuid,
                        ${row[2]}
                    )`))}
                ) AS values_table(product_id, tenant_id, new_stock)
                WHERE
                    stocks.product_id = values_table.product_id::uuid
                    AND stocks.tenant_id = values_table.tenant_id::uuid
            `;
        });
    };

    async addManualStock(tenant_id: string, stocks: MappedStockProduct[]) {
        if (stocks.length === 0) {
            throw new Error("Estoques vazios.");
        };

        await this.#prisma.$transaction(async(tx) => {

            const productsData = stocks.map(stock => [
                crypto.randomUUID(),
                tenant_id,
                stock.name,
                stock.category
            ]);


            // SYNC PRODUCTS
            await tx.$executeRaw`
                INSERT INTO products (
                    id,
                    tenant_id,
                    name,
                    category
                )
                VALUES ${this.#prismaStatic.join(productsData.map(row => this.#prismaStatic.sql`(
                    ${row[0]}::uuid,
                    ${row[1]}::uuid,
                    ${row[2]},
                    ${row[3]}
                )`))}
                ON CONFLICT (tenant_id, name)
                DO UPDATE SET
                    category = EXCLUDED.category
            `;

            const productsMap = await this.#createProductsMap(tenant_id, tx);
            // BEFORE UPSERTING NEW STOCK FOR CORRECT DELTA
            const storedStockMap = await this.#createCurrentStocksMap(tenant_id, tx);

            // ADD STOCK

            const stocksData = stocks.map(stock => {
                const product_id = productsMap.get(normalizeProduct(stock.name));

                if (!product_id) {
                    throw new Error(`Produto inválido inserido na planilha: ${stock.name}`);
                };

                return [
                    product_id,
                    tenant_id,
                    stock.quantity   
                ];
            });

            await tx.$executeRaw`
                INSERT INTO stocks(
                    product_id,
                    tenant_id,
                    current_stock
                )
                VALUES ${this.#prismaStatic.join(stocksData.map(row => this.#prismaStatic.sql`(
                    ${row[0]}::uuid,
                    ${row[1]}::uuid,
                    ${row[2]}
                )`))}
                ON CONFLICT (product_id, tenant_id)
                DO UPDATE SET
                    current_stock = EXCLUDED.current_stock   
            `;
            
            // ADD STOCK MOVEMENTS

            const movementData = stocks.flatMap(stock => {
                const product_id = productsMap.get(normalizeProduct(stock.name));

                if (!product_id) {
                    throw new Error(`Produto inválido inserido na planilha: ${stock.name}`);
                };

                const previousStock = storedStockMap.get(product_id);

                // RETURN EMPTY ARRAY FOR FLATMAP AND NOT HAVING TO FILTER AFTERWARDS
                if (!previousStock) return [];

                const movementQty = stock.quantity - previousStock;

                // TREATING MOVES LIKE THIS PREVENTS INCORRECT ANALYTICS
                // AND REDUCES DB NOISE
                if (movementQty === 0) return [];
                // ALTHOUGH IT ISNT A PROHIBITION OF THE DB
                // MANUAL IMPORTS MAY NOT HAVE STOCKS BELOW THE CURRENT
                // SINCE IT WOULD CAUSE DB INCONSISTENCY
                if (movementQty < 0) {
                    // CANCEL TRANSACTION
                    throw new Error("Estoques manuais não podem conter estoques menores que os atuais.");
                };

                return {
                    id: crypto.randomUUID(),
                    tenant_id,
                    product_id,
                    type: StockMovementType.MANUAL_IMPORT,
                    quantity: movementQty
                };
            });

            if (movementData.length > 0) {
                await tx.stock_movements.createMany({ data: movementData });
            };
        });
    };

    async deleteProduct(tenant_id: string, product_id: string) {
        return this.#prisma.products.delete({
            where: { tenant_id, id: product_id }
        });
    };

    async getStocks(tenant_id: string) {
        const stocks = await this.#prisma.stocks.findMany({
            select: {
                product_id: true,
                current_stock: true,
                products: { select: { name: true, category: true } }
            },
            where: { tenant_id }
        });

        const snapshots = await this.#prisma.processed_snapshots.findMany({
            select: {
                product_id: true,
                last_date: true,
                last_unit_cost: true,
                last_unit_profit_margin: true,
                last_cumulative_qty: true,
                last_cumulative_revenue: true,
                last_cumulative_cost: true,
                last_cumulative_profit: true
            },
            where: { tenant_id }
        });

        const snapshotsMap = new Map(
            snapshots.map(snapshot => [snapshot.product_id, snapshot])
        );

        const mapped = stocks.flatMap(stock => {
            const snap = snapshotsMap.get(stock.product_id);

            if (!snap) return [];

            // ARRAY FOR FLATMAP
            return [{
                product_id: stock.product_id,
                product_name: stock.products.name,
                product_category: stock.products.category,

                current_stock: stock.current_stock.toNumber(),

                sold_qty: snap.last_cumulative_qty ?? 0,
                revenue: snap.last_cumulative_revenue.toNumber() ?? 0,
                profit: snap.last_cumulative_profit.toNumber() ?? 0,

                unit_cost: snap.last_unit_cost.toNumber() ?? 0,
                margin: snap.last_unit_profit_margin.toNumber() ?? 0,

                last_updated: snap.last_date ?? null
            }];
        });

        return mapped;
    };

    async getLastSales(tenant_id: string) {
        const salesRaw = await this.#prisma.stock_movements.findMany({
            select: {
                quantity: true,
                products: {
                    select: {
                        name: true
                    }
                }
            },
            take: 20,
            where: { tenant_id, type: "SALE" }
        });

        const lastSales = salesRaw.map(sale => ({
            product_name: sale.products.name,
            quantity: sale.quantity
        }));

        return lastSales;
    };
};