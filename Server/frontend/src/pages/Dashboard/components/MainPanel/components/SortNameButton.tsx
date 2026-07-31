import { AArrowDown, AArrowUp, ALargeSmall } from "lucide-react"
import type { Dispatch, SetStateAction } from "react";
import type { Sorts } from "@dashboard/types/types";

function handleClick(sortType: Sorts, setSortType: Dispatch<SetStateAction<Sorts | null>>) {
    switch (sortType) {
        case "name-asc":
            setSortType("name-desc");
            break;
        case "name-desc":
            setSortType(null);
            break;
        default:
            setSortType("name-asc");
            break;
    };
};

function renderIcon(sortType: Sorts) {
    switch (sortType) {
        case "name-asc":
            return <AArrowUp className="text-text h-10 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        case "name-desc":
            return <AArrowDown className="text-text h-10 sm:hover:-translate-y-0.5 transition-transform duration-200" />
        default:
            return <ALargeSmall className="text-text-muted h-10 sm:hover:-translate-y-0.5 hover:text-text transition-all duration-200" />
    };
};

export function SortNameButton({ sortType, onClick }: { sortType: Sorts,  onClick: Dispatch<SetStateAction<Sorts>> }) {
    return (
        <button type="button" onClick={() => handleClick(sortType, onClick)}>
              {renderIcon(sortType)}
        </button>
    );
};