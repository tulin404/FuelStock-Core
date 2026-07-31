// DASHBOARD ONLY TYPES

export type Product = {
    product_id: string,
    product_name: string,
    product_category: string,
    current_stock: number,
    sold_qty: number,
    revenue: number,
    profit: number,
    unit_cost: number,
    margin: number,
    coverage_status:
        "low" | "medium" | "ok" | "over",
    margin_status: 
        "low" | "medium" | "ok" | "over",
    last_updated: string
};

export type Sale = {
    product_name: string,
    quantity: number,
};

export type Sorts = 
    "stock-desc" | "stock-asc" |
    "name-desc" | "name-asc" |
    "sold-desc" | "sold-asc" |
    "revenue-desc" | "revenue-asc" |
    "profit-desc" | "profit-asc" |
    "margin-desc" | "margin-asc";

export type ChangeProduct = {
    id: string,
    change: number,
    newStock: number
};

export type Variants = "stock" | "margin";
export type Status = "low" | "medium" | "ok" | "over";

export type Users = {
    id: string,
    name: string,
    email: string,
    role: "admin" | "user"
};

export type KPIs = {
    products: number,
    stockValue: number,
    monthSales: number,
    monthProfit: number
};

export type StatusCount = {
    low: number,
    medium: number
};

export type StockAnalytics = {
    date: Date | string,
    stock_in: number,
    stock_out: number
};

export type StockAnalyticsRange = "7d" | "30d" | "90d" | "365d";

export type AIAnalysis = {
    year: number | null,
    month: number | null,
    analysis_text: string | null
};