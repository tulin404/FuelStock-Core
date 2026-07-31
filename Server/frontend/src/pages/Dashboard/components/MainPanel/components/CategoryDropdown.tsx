import { formatCategory } from "@/pages/Dashboard/helpers/textFormatters";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export function CategoryDropdown({ categories, filters, setFilters }: { categories: Set<string>, filters: string[], setFilters: Dispatch<SetStateAction<string[]>> }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleChange(changeCategory: string) {
        if (filters.includes(changeCategory)) {
            setFilters(prev => prev.filter(category => category !== changeCategory));
        } else {
            setFilters(prev => [...prev, changeCategory]);
        };
    };

    const categoriesArray = Array.from(categories);
    
    return (
        <div className="flex 2xl:hidden justify-end">
            <button onClick={() => setIsOpen(!isOpen)} className="w-min rounded-md bg-surface px-2 py-1 text-left text-text border-2 border-border text-sm whitespace-nowrap">
                {filters.length
                    ? `${filters.length} selecionados`
                    : <span className="text-">Categorias</span>
                }
            </button>

            {isOpen && (
                <div className="absolute top-14 mt-0.5 w-fit rounded-md bg-white shadow-lg z-20 border-border border-2
                    before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-linear-to-b before:from-surface before:via-surface/50 before:to-transparent before:pointer-events-none before:rounded-md
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-linear-to-t after:from-surface after:via-surface/50 after:to-transparent after:pointer-events-none after:rounded-md
                    ">
                    <div className="overflow-y-scroll max-h-48">
                        {categoriesArray.map(category => (
                            <label key={category} className="flex text-sm text-text cursor-pointer items-center gap-2 px-4 py-2 hover:bg-surface-hover transition-colors duration-200">
                                <input
                                    type="checkbox"
                                    checked={filters.includes(category)}
                                    onChange={() => handleChange(category)}
                                    className="checked:bg-primary outline-0 ring-0 border-border rounded-sm"
                                />
                                {formatCategory(category)}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};