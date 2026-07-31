import { formatter } from "./date.formatter.js";

export function getTodayInSP(): Date {
    const [year, month, day] = formatter
        .format(new Date())
        .split("-")
        .map(Number);

    return new Date(year!, month! - 1, day);
};