import { Decimal } from "@prisma/client/runtime/library";

export type DailyParseResult = {
    data: {
        tenantName: string;
        productData: MappedDailyProduct[];
    }
};

export type RawStockProduct = {
    Produto: string,
    Quantidade: number,
    Categoria: string
};

export type StockProduct = {
    id: string,
    change: number,
    newStock: number
};

export type MappedStockProduct = {
    name: string,
    quantity: number,
    category: string
};

export type MappedDailyProduct = {
    productName: string,
    unitRevenue: number,
    unitCost: number,
    unitProfitMargin: number,
    totalSoldQty: number,
    totalRevenue: number,
    totalCost: number,
    totalProfit: number
};

export type Delta = {
    product_id: string,
    import_id: string,
    unit_cost: number,
    delta: number
};

export type MonthlyMetric = {
    id: string;
    tenant_id: string;
    product_id: string;
    year: number;
    month: number;
    unit_cost: Decimal,
    unit_profit_margin: Decimal,
    total_sold_qty: Decimal;
    total_revenue: Decimal;
    total_cost: Decimal;
    total_profit: Decimal;
    created_at: Date;
};

export type ProductAnalytics = {
    productName: string;

    currentMonthSoldQty: number;
    previousMonthSoldQty: number;

    growthPct: number | null;

    revenue: Decimal;
    cost: Decimal;
    profit: Decimal;

    unitProfitMarginPct: Decimal | string;

    trend: 'up' | 'down' | 'stable' | 'new' | 'insufficient_history';
};

export type FilteredMetrics = { insufficientHistory: boolean } | {
    currency: string;
    timePeriod: string;
    topRevenueProducts: ProductAnalytics[];
    topGrowingProducts: ProductAnalytics[] | null; // null FOR SINGLE MONTH REPORTS
    topDeclineProducts: ProductAnalytics[] | null;
    lowMarginProducts: ProductAnalytics[];
};

export type StockValueResult = {
    sum: string | null
};