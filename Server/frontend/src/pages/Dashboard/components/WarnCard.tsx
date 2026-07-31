import type { Status } from "../types/types";

export function WarnCard({ variant, data, legend }: { variant: Omit<Status, "over" | "ok">, data: number, legend: string }) {
    // SAFETY CHECK
    if (variant === "over" || variant === "ok") return null;

    function getColors() {
        if (variant === "medium") {
            return ({
                bg: "bg-warning-surface",
                text: "text-warning",
                border: "border-warning-border"
            });
        } else /* CASE "low" */ {
            return ({
                bg: "bg-danger-surface",
                text: "text-danger",
                border: "border-danger-border"
            });
        };
    };

    const colors = getColors();

    return (
        <div className={`${colors.bg} border-2 ${colors.border} p-4 rounded-lg ${colors.text}`}>
            <h3 className="font-semibold font-main text-2xl text-center 2xl:text-left">{data}</h3>
            <h4 className="font-secondary md:text-lg text-center lg:text-left">{legend}</h4>
        </div>
    );
};