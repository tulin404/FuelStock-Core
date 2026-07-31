import type { Product } from "../types/types";
import { dateFormatter } from "@/pages/Dashboard/helpers/formatters";

export function getCoverageStatus(product: Product) {
    const monthToNow = parseInt(dateFormatter.format(new Date()), 10);
    const monthToDate = monthToNow - 1; // DAYS SINCE MONTH BEGGINING UNTIL TODAY

    const avgDailySales = product.sold_qty / monthToDate;
    const coverageDays = Number(Math.floor(product.current_stock / avgDailySales));

    if (coverageDays <= 7) {
        return "low";
    } else if (coverageDays > 7 && coverageDays <= 20) {
        return "medium";
    } else if (coverageDays > 20 && coverageDays <= 60) {
        return "ok";
    } else {
        return "over";
    };
};