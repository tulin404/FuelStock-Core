import type { Variants, Product } from "@dashboard/types/types";
import { StatusIcon } from "./StatusIcon";

export function Badge({ variant, product }: { variant: Variants, product: Product }) {
    switch (variant) {
        case "stock": {
            const coverageStatus = product.coverage_status;

            return (
                <div className="flex items-center gap-2 sm:gap-3">
                    <StatusIcon
                    status={coverageStatus}
                    desc={
                        coverageStatus === "low" ?
                        "Repor imediatamente" :
                        coverageStatus === "medium" ? 
                        "Planejar reposição" :
                        coverageStatus === "ok" ?
                        "Operação normal" :
                        "Possível excesso de estoque"
                    } />
                    <span>{product.current_stock}</span>
                </div>
            );
        };
        case "margin": {
            const marginStatus = product.margin_status;

            return (
                <div className="flex items-center gap-2 sm:gap-3">
                    <StatusIcon
                    status={marginStatus}
                    desc={
                        marginStatus === "low" ?
                        "Reavaliar preço ou custo" :
                        marginStatus === "medium" ?
                        "Rentabilidade estável" :
                        marginStatus === "ok" ?
                        "Produto rentável" :
                        "Alta rentabilidade"
                    } />
                    <span>{product.margin}%</span>
                </div>
            )
        };
        default:
            return;
    };
};