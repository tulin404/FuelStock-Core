import type { Sorts, Product } from "@dashboard/types/types";

export function productSorter(stocks: Product[], type: Sorts) {
    if (type === null) return stocks;

    switch(type) {
        case "stock-desc":
            return stocks.toSorted((a, b) => Number(b.current_stock) - Number(a.current_stock));
        case "stock-asc":
            return stocks.toSorted((a, b) => Number(a.current_stock) - Number(b.current_stock));
        case "name-desc":
            return stocks.toSorted((a, b) => a.product_name.localeCompare(b.product_name));
        case "name-asc":
            return stocks.toSorted((a, b) => b.product_name.localeCompare(a.product_name));
        case "sold-desc":
            return stocks.toSorted((a, b) => Number(a.sold_qty) - Number(b.sold_qty));
        case "sold-asc":
            return stocks.toSorted((a, b) => Number(b.sold_qty) - Number(a.sold_qty));
        case "revenue-desc":
            return stocks.toSorted((a, b) => Number(a.revenue) - Number(b.revenue));
        case "revenue-asc":
            return stocks.toSorted((a, b) => Number(b.revenue) - Number(a.revenue));
        case "profit-desc":
            return stocks.toSorted((a, b) => Number(a.profit) - Number(b.profit));
        case "profit-asc":
            return stocks.toSorted((a, b) => Number(b.profit) - Number(a.profit));
        case "margin-desc":
            return stocks.toSorted((a, b) => Number(a.margin) - Number(b.margin));
        case "margin-asc":
            return stocks.toSorted((a, b) => Number(b.margin) - Number(a.margin));
        default:
            return stocks;
    };
};