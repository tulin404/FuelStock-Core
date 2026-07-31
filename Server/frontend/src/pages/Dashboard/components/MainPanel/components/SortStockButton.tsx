import { ArrowUpWideNarrow, ArrowDownWideNarrow, Package } from "lucide-react"
import type { Dispatch, SetStateAction } from "react";
import type { Sorts } from "@dashboard/types/types";

function handleClick(sortType: Sorts, setSortType: Dispatch<SetStateAction<Sorts | null>>) {
    switch (sortType) {
        case "stock-asc":
            setSortType("stock-desc");
            break;
        case "stock-desc":
            setSortType(null);
            break;
        default:
            setSortType("stock-asc");
            break;
    };
};

function renderIcon(sortType: Sorts) {
    switch (sortType) {
        case "stock-asc":
            return <ArrowUpWideNarrow className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        case "stock-desc":
            return <ArrowDownWideNarrow className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        default:
            return <Package className="text-text-muted h-6 sm:hover:-translate-y-0.5 hover:text-text transition-all duration-200" />
    };
};

export function SortStockButton({ sortType, onClick }: { sortType: Sorts,  onClick: Dispatch<SetStateAction<Sorts | null>> }) {
    return (
        <button type="button" onClick={() => handleClick(sortType, onClick)}>
              {renderIcon(sortType)}
        </button>
    );
};