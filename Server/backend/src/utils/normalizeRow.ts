import type { MappedDailyProduct, MappedStockProduct, RawStockProduct } from "../types/types.js";

export function normalizeDailyRow(row: string[]): MappedDailyProduct {
    return {
        productName: row[0]?.trim() ?? "Produto sem nome",
        unitRevenue: Number(row[1]?.trim().replace(",", ".")),
        unitCost: Number(row[2]?.trim().replace(",", ".")),
        unitProfitMargin: Number(row[3]?.trim().replace(",", ".")),

        totalSoldQty: Number(row[5]?.slice(0, 4).trim().replace(".", "").replace(",", ".")),

        totalRevenue: Number(row[6]?.trim().replace(".", "").replace(",", ".")),
        totalCost: Number(row[7]?.trim().replace(".", "").replace(",", ".")),
        totalProfit: Number(row[8]?.trim().replace(".", "").replace(",", "."))
    };
};

export function normalizeStockRow(row: RawStockProduct): MappedStockProduct {
    return {
        name: row.Produto,
        quantity: Number(row.Quantidade),
        category: row.Categoria
    };
};