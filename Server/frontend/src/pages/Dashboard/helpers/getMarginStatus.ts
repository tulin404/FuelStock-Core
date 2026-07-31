import type { Status } from "../types/types";

export function getMarginStatus(margin: number): Status {
    if (margin <= 5) {
        return "low";
    } else if (margin > 5 && margin <= 15) {
        return "medium";
    } else if (margin > 15 && margin <= 30) {
        return "ok";
    } else {
        return "over";
    };
};