import { formatCategory } from "../helpers/textFormatters";
import { SlidersHorizontal } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export function FilterPanel({ categories, filters, setFilters }: { categories: Set<string>, filters: string[], setFilters: Dispatch<SetStateAction<string[]>> }){
    function handleChange(changeCategory: string) {
        if (filters.includes(changeCategory)) {
            setFilters(prev => prev.filter(category => category !== changeCategory));
        } else {
            setFilters(prev => [...prev, changeCategory]);
        };
    };

    return (
        <div className="bg-surface rounded-xl p-4 shadow-xs h-min border-2 border-border sm:hover:border-border-hover transition-colors duration-200 text-left">
            <div className="flex items-center gap-2 pb-2">
                <SlidersHorizontal className="text-text" />
                <h1 className="font-main text-2xl font-semibold text-text">Filtros</h1>
            </div>
            <fieldset className="flex flex-col gap-1">
                {Array.from(categories).map(category => (
                    <label key={category} className="flex gap-2 items-center justify-start font-secondary leading-tight">
                        <input
                        className="checked:bg-primary outline-none ring-0 border-border rounded-sm transition-colors duration-200"
                        type="checkbox"
                        checked={filters.includes(category)}
                        onChange={() => handleChange(category)}
                        />
                        {formatCategory(category)}
                    </label>
                ))}
            </fieldset>
        </div>
    );
};