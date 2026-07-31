import type { StockAnalyticsRange } from "../types/types";

export function formatCategory(category: string) {
    const lower = category.toLowerCase();
    const splitted = lower.split(" ");
    const upper = splitted.map(part => {
        if (part.length > 2) {
            const firstCharUpper = part.charAt(0).toUpperCase();
            const rest = part.slice(1);
            return `${firstCharUpper}${rest}`;
        };
        return part;
    });
    return upper.join(" ");
};

export function formatRange(range: StockAnalyticsRange) {
    switch(range) {
        case "7d": return "7 dias";
        case "30d": return "30 dias";
        case "90d": return "90 dias";
        case "365d": return "365 dias";
    };
};