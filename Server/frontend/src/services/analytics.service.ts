import type { StockAnalytics, StockAnalyticsRange } from "@dashboard/types/types";
import { ApiError } from "@/utils/ApiError";
import { jwtFetch } from "@/utils/jwtFetch";

export class AnalyticsService {
    // KPIs ARE VITAL SO NO ERROR CHECK
    static async getKPIs() {
        const raw = await jwtFetch("api/analytics/kpis", {
            credentials: "include"
        });
        const parsed = await raw.json();
        return parsed.data;
    };

    static async getStockAnalytics() {
        const raw = await jwtFetch("api/analytics/movements", {
            credentials: "include"
        });
        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return response.data;
    };

    static #getAnalyticsWeekKey(date: Date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    };

    static #groupByWeek(stockAnalytics: StockAnalytics[]) {
        const grouped = new Map<string, StockAnalytics>();

        for (const analytic of stockAnalytics) {
            const weekStart = new Date(analytic.date);

            // EX: 13/07
            // getDate() = 13
            // getDay() = 01 (monday)
            // 13 - 1 = 12 (sunday -> start of the week)
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);

            const key = this.#getAnalyticsWeekKey(weekStart);

            if (!grouped.has(key)) {
                grouped.set(key, {
                    date: key.split("-").slice(0, 2).join("/"),
                    stock_in: 0,
                    stock_out: 0
                });
            };

            const week = grouped.get(key);
            week.stock_in =
                Number(
                    (week.stock_in + Number(analytic.stock_in)).toFixed(2)
                );
            week.stock_out = Number(
                (week.stock_out + Number(analytic.stock_out)).toFixed(2)
            );
        };

        return [...grouped.values()];
    };

    static #groupByMonth(stockAnalytics: StockAnalytics[]) {
        const grouped = new Map<string, StockAnalytics>();

        for (const analytic of stockAnalytics) {
            const analyticDate = new Date(analytic.date);
            const key = `${String(analyticDate.getMonth() + 1).padStart(2, "0")}/${analyticDate.getFullYear()}`

            if (!grouped.has(key)) {
                grouped.set(key, {
                    date: key,
                    stock_in: 0,
                    stock_out: 0
                });
            };

            const month = grouped.get(key);
            month.stock_in =
                Number(
                    (month.stock_in + Number(analytic.stock_in)).toFixed(2)
                );
            month.stock_out = Number(
                (month.stock_out + Number(analytic.stock_out)).toFixed(2)
            );
        };

        return [...grouped.values()];
    };

    static prepareChartData(stockAnalytics: StockAnalytics[], range: StockAnalyticsRange) {
        const days = parseInt(range, 10);

        switch (range) {
            case "7d":
            case "30d": {
                const formatted = stockAnalytics.map(analytic => ({
                    ...analytic,
                    date: String(analytic.date).split("T")[0].split("-").reverse().slice(0, 2).join("/")
                }));
                return formatted.slice(-days);
            }
            case "90d":
                return this.#groupByWeek(stockAnalytics.slice(-days));
            case "365d":
                return this.#groupByMonth(stockAnalytics.slice(-days));
        };
    };
};