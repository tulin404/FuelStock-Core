import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react";
import type { StockAnalyticsRange } from "@dashboard/types/types";
import { formatRange } from "@dashboard/helpers/textFormatters";

export function ChartDropDown({ range, setRange, availableRanges }: { range: StockAnalyticsRange, setRange: Dispatch<SetStateAction<StockAnalyticsRange>>, availableRanges: StockAnalyticsRange[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const options: StockAnalyticsRange[] = ["7d", "30d", "90d", "365d"];
    const availableSet = new Set(availableRanges);
    const unavailableRanges = options.filter(option => !availableSet.has(option));

    useEffect(() => {
        function handleOutsideClick() {
            setIsOpen(false);
        };

        window.addEventListener("click", handleOutsideClick);

        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
        <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev) }} className="group self-center border-2 border-border sm:hover:border-border-hover rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 pl-2 py-0.5">
                <span className="font-secondary text-sm sm:text-base text-center font-semibold">{formatRange(range)}</span>
                <span className={`${isOpen ? "rotate-180" : "rotate-0"} text-border-hover sm:group-hover:text-text-muted transition-all duration-200`}><ChevronDown /></span>
            </button>
            {isOpen &&
                <div className="absolute top-10 mt-0.5 w-fit rounded-md bg-white shadow-lg z-20 border-border border-2 py-1">
                        {availableRanges.map(range => 
                            <button key={range} onClick={() => setRange(range)} className="w-full text-left font-secondary text-text max-h-48 hover:bg-background px-2 transition-colors duration-200">
                                {formatRange(range)}
                            </button>
                        )}
                        {unavailableRanges.map(range => 
                            <button key={range} disabled onClick={() => setRange(range)} className="w-full text-left cursor-default! font-secondary text-text-disabled overflow-y-scroll max-h-48 px-2">
                                {formatRange(range)}
                            </button>
                        )}
                </div>
            }
        </div>
    )
};