import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import type { Dispatch, SetStateAction } from "react";
import type { Sorts } from "@dashboard/types/types";

function handleClick(sortType: Sorts, setSortType: Dispatch<SetStateAction<Sorts | null>>) {
    switch (sortType) {
        case "profit-asc":
            setSortType("profit-desc");
            break;
        case "profit-desc":
            setSortType(null);
            break;
        default:
            setSortType("profit-asc");
            break;
    };
};

function renderIcon(sortType: Sorts) {
    switch (sortType) {
        case "profit-asc":
            return <TrendingUp className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        case "profit-desc":
            return <TrendingDown className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        default:
            return <PiggyBank className="text-text-muted h-5.5 sm:hover:-translate-y-0.5 sm:hover:text-text transition-all duration-200" />
    };
};

export function SortProfitButton({ sortType, onClick }: { sortType: Sorts, onClick: Dispatch<SetStateAction<Sorts | null>> }) {
    return (
        <button type="button" onClick={() => handleClick(sortType, onClick)}>
              {renderIcon(sortType)}
        </button>
    );
};