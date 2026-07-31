import { ArrowUp, ArrowDown, Percent } from "lucide-react"
import type { Dispatch, SetStateAction } from "react";
import type { Sorts } from "@dashboard/types/types";

function handleClick(sortType: Sorts, setSortType: Dispatch<SetStateAction<Sorts | null>>) {
    switch (sortType) {
        case "margin-asc":
            setSortType("margin-desc");
            break;
        case "margin-desc":
            setSortType(null);
            break;
        default:
            setSortType("margin-asc");
            break;
    };
};

function renderIcon(sortType: Sorts) {
    switch (sortType) {
        case "margin-asc":
            return <ArrowUp className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        case "margin-desc":
            return <ArrowDown className="text-text h-6 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        default:
            return <Percent className="text-text-muted h-5.5 sm:hover:-translate-y-0.5 hover:text-text transition-all duration-200" />
    };
};

export function SortMarginButton({ sortType, onClick }: { sortType: Sorts,  onClick: Dispatch<SetStateAction<Sorts | null>> }) {
    return (
        <button type="button" onClick={() => handleClick(sortType, onClick)}>
              {renderIcon(sortType)}
        </button>
    );
};