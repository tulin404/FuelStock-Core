import { getCoverageStatus } from "@/pages/Dashboard/helpers/getCoverageStatus";
import { getMarginStatus } from "@/pages/Dashboard/helpers/getMarginStatus";
import type { ChangeProduct, Product } from "@/pages/Dashboard/types/types";
import { ApiError } from "@/utils/ApiError";
import { jwtFetch } from "@/utils/jwtFetch";

export class StockService {
    // STOCKS ARE VITAL SO NO ERROR CHECK
    static async getStocks() {
        const raw = await jwtFetch("api/stocks");
        const parsed = await raw.json();
        console.log(parsed);
        const mapped = parsed.data.map((product: Product) => ({
            ...product,
            coverage_status: getCoverageStatus(product),
            margin_status: getMarginStatus(product.margin)
        }));
        return mapped;
    };
    
    static async deleteProduct(productId: string) {
        const raw = await jwtFetch(`api/stocks/delete/${productId}`, {
            method: "DELETE"
        });

        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return response.message;
    };

    static async saveStock(productsToChange: ChangeProduct[]) {
        const raw = await jwtFetch("api/stocks/adjust", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: productsToChange
            })
        });

        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return response.message;
    };

    static async refillStock(formData: FormData) {
        const raw = await jwtFetch("api/stocks/refill", {
            method: "POST",
            body: formData
        });

        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return response.message;
    };

    static async getLastSales() {
        const raw = await jwtFetch("api/stocks/sales");
        const response = await raw.json();
        return response.data;
    };
};