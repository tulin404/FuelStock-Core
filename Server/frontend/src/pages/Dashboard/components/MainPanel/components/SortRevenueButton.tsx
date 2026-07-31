import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import type { Dispatch, SetStateAction } from "react";
import type { Sorts } from "@dashboard/types/types";

function handleClick(sortType: Sorts, setSortType: Dispatch<SetStateAction<Sorts | null>>) {
    switch (sortType) {
        case "revenue-asc":
            setSortType("revenue-desc");
            break;
        case "revenue-desc":
            setSortType(null);
            break;
        default:
            setSortType("revenue-asc");
            break;
    };
};

function renderIcon(sortType: Sorts) {
    switch (sortType) {
        case "revenue-asc":
            return <ArrowUpRight className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        case "revenue-desc":
            return <ArrowDownRight className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        default:
            return <DollarSign className="text-text-muted h-5.5 sm:hover:-translate-y-0.5 sm:hover:text-text transition-all duration-200" />
    };
};

export function SortRevenueButton({ sortType, onClick }: { sortType: Sorts,  onClick: Dispatch<SetStateAction<Sorts | null>> }) {
    return (
        <button type="button" onClick={() => handleClick(sortType, onClick)}>
              {renderIcon(sortType)}
        </button>
    );
};