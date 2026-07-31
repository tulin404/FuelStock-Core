import { PrismaClient } from "../generated/prisma/client.js";
import type { FilteredMetrics, ProductAnalytics, StockValueResult } from "../types/types.js";
import { getTodayInSP } from "../utils/getTodayInSP.js";
import normalizeProduct from "../utils/normalizeProduct.js";

export class AnalyticsService{
    readonly #prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    async #createProductsMap(tenant_id: string) {
        const productsMap = new Map<string, string>();

        const products = await this.#prisma.products.findMany({
            where: { tenant_id },
            select: { id: true, name: true }
        });

        for (const product of products) {
            const key = product.id;
            productsMap.set(key, normalizeProduct(product.name));
        };

        return productsMap;
    };

    // getTwoLatestMonths RETURNS THE TWO LATEST MONTHS RECORDED IN THE product_monthly_sales TABLE
    getTwoLatestMonths(tenant_id: string) {
        return this.#prisma.product_monthly_sales.groupBy({
            by: ["year", "month"],
            where: { tenant_id },
            orderBy: [
                { year: "desc" },
                { month: "desc" }
            ],
            take: 2
        });
    };

    // singleMonthReport RETURNS THE LATEST MONTH REPORT IN CASE OF NOT HAVING THE PREVIOUS MONTH TO COMPARE
    async #singleMonthReport(tenant_id: string): Promise<ProductAnalytics[]> {

        const productsMap = await this.#createProductsMap(tenant_id);
        const lastMonthProducts = await this.#prisma.product_monthly_sales.findMany({
            where: { tenant_id }
        });

        const mapped = lastMonthProducts.map(product => {
            return {
                productName: productsMap.get(product.product_id) ?? "Produto sem nome",

                currentMonthSoldQty: product.total_sold_qty.toNumber(),
                previousMonthSoldQty: 0,
                
                growthPct: null,
                
                revenue: product.total_revenue,
                cost: product.total_cost,
                profit: product.total_profit,

                unitProfitMarginPct: product.unit_profit_margin,

                trend: "insufficient_history" as const
            };
        });

        return mapped;
    };

    async #getMonthlyMetrics(tenant_id: string) {
        const twoLatestMonths = await this.getTwoLatestMonths(tenant_id);

        // TWO LAST REGISTERED DATES ON product_monthly_sales TABLE
        const [latest, previous] = twoLatestMonths;

        if (!latest) return null;
        if (!previous) {
            return this.#singleMonthReport(tenant_id);
        };

        const twoLatestMonthsRegisters = await this.#prisma.product_monthly_sales.findMany({
            where: {
                // GET LAST 2 MONTHS
                tenant_id,
                OR: twoLatestMonths
            }
        });

        // NAMES
        const productsMap = await this.#createProductsMap(tenant_id);

        const lastMonthProducts = [];
        const previousMonthProducts = [];

        for (const product of twoLatestMonthsRegisters) {
            if (product.year === latest.year && product.month === latest.month) {
                lastMonthProducts.push(product);
            } else {
                previousMonthProducts.push(product);
            };
        };

        // O(1)
        const previousMap = new Map(
            previousMonthProducts.map(product => [product.product_id, product])
        );

        const mapped: ProductAnalytics[] = lastMonthProducts.map(product => {
            const previousProduct = previousMap.get(product.product_id);

            const productName = productsMap.get(product.product_id) ?? "Produto sem nome";

            const currentMonthSoldQty = product.total_sold_qty.toNumber();
            const previousMonthSoldQty = previousProduct?.total_sold_qty.toNumber() ?? 0;

            let growthPct;
            let trend;

            if (previousMonthSoldQty !== 0) {
                growthPct = Number((((currentMonthSoldQty - previousMonthSoldQty) / previousMonthSoldQty) * 100).toFixed(2));

                if (growthPct > 10) {
                    trend = "up" as const;
                } else if (growthPct < -10) {
                    trend = "down" as const;
                } else {
                    trend = "stable" as const;
                };

            } else {
                growthPct = null;
                trend = "new" as const;
            };

            const revenue = product.total_revenue;
            const cost = product.total_cost;
            const profit = product.total_profit;
            
            const unitProfitMarginPct = product.unit_profit_margin;

            return {
                productName,

                currentMonthSoldQty,
                previousMonthSoldQty,

                growthPct,

                revenue,
                cost,
                profit,

                unitProfitMarginPct,

                trend
            };
        });

        return mapped;

    };

    async getFilteredMetrics(tenant_id: string): Promise<FilteredMetrics> {
        const metrics = await this.#getMonthlyMetrics(tenant_id);
        
        if (!metrics) return ({ insufficientHistory: true });

        // LATEST WILL NEVER BE NULL SINCE METRICS CHECK WILL ALWAYS CATCH THIS EXCEPTION
        const [latest] = await this.getTwoLatestMonths(tenant_id);

        return {
            currency: "BRL",
            timePeriod: `${latest?.year}-${latest?.month}`,
            topRevenueProducts: this.#filterRevenueProducts(metrics),
            topGrowingProducts: this.#filterGrowingProducts(metrics),
            topDeclineProducts: this.#filterDeclineProducts(metrics),
            lowMarginProducts: this.#filterLowMarginProducts(metrics)
        };
    };

    #filterRevenueProducts(metrics: ProductAnalytics[]) {
        return metrics.sort((a, b) => b.revenue.toNumber() - a.revenue.toNumber()).slice(0, 10);
    };

    #filterGrowingProducts(metrics: ProductAnalytics[]) {
        // NOISE REMOVING
        const filtered = metrics.filter(product => product.currentMonthSoldQty >= 20 && product.growthPct !== null);

        if (filtered.length === 0) return null;
        
        // NULLISH COALESCING FOR TS CHECK
        return filtered.sort((a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0)).slice(0, 10);
    };

    #filterDeclineProducts(metrics: ProductAnalytics[]) {
        const filtered = metrics.filter(product => product.growthPct !== null);

        if (filtered.length === 0) return null;

        return filtered.sort((a, b) => (a.growthPct ?? 0) - (b.growthPct ?? 0)).slice(0, 10);
    };

    #filterLowMarginProducts(metrics: ProductAnalytics[]) {
        const filtered = metrics.filter(product => Number(product.unitProfitMarginPct) < 10);

        return filtered.sort((a, b) => b.revenue.toNumber() - a.revenue.toNumber()).slice(0, 10);
    };

    // MOVEMENTS

    async getStockAnalytics(tenant_id: string) {
        const oneYearAgo = getTodayInSP();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        return this.#prisma.stock_analytics.findMany({
            select: { date: true, stock_in: true, stock_out: true },
            where: {
                tenant_id,
                date: {
                    gte: oneYearAgo
                }
            },
            orderBy: { date: "asc" }
        });
    };

    async generateAnalytics() {
        const tenants = await this.#prisma.tenants.findMany({ select: { id: true } });
        for (const tenant of tenants) {
            await this.#prisma.$transaction(async(tx) => {
                const tenant_id = tenant.id;
                
                const stockMovements = await tx.stock_movements.findMany({ where: { tenant_id } });
    
                if (stockMovements.length === 0) return;
    
                await tx.$executeRaw
                `
                    INSERT INTO stock_analytics (
                        tenant_id,
                        date,
                        stock_in,
                        stock_out
                    )
                    SELECT
                        tenant_id,
                        (created_at AT TIME ZONE 'America/Sao_Paulo')::date,
        
                        COALESCE(
                            SUM(quantity)
                            FILTER (
                                WHERE type IN ('MANUAL_IMPORT', 'ADJUSTMENT')
                            ),
                            0
                        ) AS stock_in,
        
                        COALESCE(
                            SUM(quantity)
                            FILTER (
                                WHERE type = 'SALE'
                            ),
                            0
                        ) AS stock_out
        
                    FROM stock_movements
                    WHERE tenant_id = ${tenant_id}::uuid
                    GROUP BY
                        tenant_id,
                        (created_at AT TIME ZONE 'America/Sao_Paulo')::date
        
                    ON CONFLICT (tenant_id, date)
                    DO UPDATE SET
                        stock_in = EXCLUDED.stock_in,
                        stock_out = EXCLUDED.stock_out
                `;
    
                // CLEAR ALL THE MOVEMENTS SINCE THIS RUNS DAILY
                await tx.stock_movements.deleteMany({ where: { tenant_id } });
                // CLEANUP LETTING ONLY THE LAST 400 DAYS EXIST PER TENANT
                await tx.$executeRaw`
                    DELETE FROM stock_analytics
                    WHERE tenant_id = ${tenant_id}::uuid
                    AND date IN (
                        SELECT date
                        FROM stock_analytics
                        WHERE tenant_id = ${tenant_id}::uuid
                        ORDER BY date DESC
                        OFFSET 400
                    )
                `;
            });
        };
    };

    async getKPIs(tenant_id: string) {
        const productsCount = await this.#prisma.products.count({ where: { tenant_id } });
        const stockValue = await this.#prisma.$queryRaw<StockValueResult[]>
        `
            SELECT
                SUM(s.current_stock * ps.last_unit_cost)
            FROM stocks s
            JOIN processed_snapshots ps
            ON s.product_id = ps.product_id
            WHERE s.tenant_id = ${tenant_id}::uuid
        `;
        const monthSales = await this.#prisma.processed_snapshots.aggregate({
            _sum: { last_cumulative_qty: true },
            where: { tenant_id }
        });
        const monthProfit = await this.#prisma.processed_snapshots.aggregate({
            _sum: { last_cumulative_profit: true },
            where: { tenant_id }
        });

        return {
            products: productsCount,
            stockValue: Number(stockValue[0]?.sum ?? 0),
            monthSales: monthSales._sum.last_cumulative_qty,
            monthProfit: monthProfit._sum.last_cumulative_profit?.toNumber()
        };
    };
};