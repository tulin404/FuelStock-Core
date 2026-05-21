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