import { useEffect, useLayoutEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { MainPanel } from "./components/MainPanel/MainPanel";
import { Header } from "./components/Header/Header";
import type { AIAnalysis, Product, Sale, StockAnalytics } from "./types/types";
import { FilterPanel } from "./components/FilterPanel";
import { StockService } from "@/services/stock.service";
import { UsersPanel } from "./components/UsersPanel/UsersPanel";
import { useAuthStore } from "@/stores/auth.store";
import { LastSalesPanel } from "./components/LastSalesPanel";
import { KPIPanel } from "./components/KPIPanel/KPIPanel";
import type { KPIs } from "./types/types";
import { AnalyticsService } from "@/services/analytics.service";
import { WarnCard } from "./components/WarnCard";
import { ChatButton } from "./components/AI/components/ChatButton";
import { AI } from "./components/AI/AI";
import { AIService } from "@/services/ai.service";

export function Dashboard() {
    const [stocks, setStocks] = useState<Product[] | null>(null);
    const [KPIs, setKPIs] = useState<KPIs | null>(null);
    const [stockAnalytics, setStockAnalytics] = useState<StockAnalytics[] | null>(null);
    const [lastSales, setLastSales] = useState<Sale[] | null>(null);
    const [AIAnalyses, setAIAnalyses] = useState<AIAnalysis[] | null>(null);

    const [isEdit, setIsEdit] = useState(false);
    const [filters, setFilters] = useState<string[]>([]);

    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);
    const [isBigScreen, setIsBigScreen] = useState(() => window.matchMedia("(min-width: 1536px)").matches);

    const [isAIOpen, setIsAIOpen] = useState(false);

    const isAdmin = useAuthStore((state) => state.user.role === "admin");

    useLayoutEffect(() => {
        document.documentElement.classList.add("bg-background!");
        document.documentElement.style.removeProperty("background-color");

        return () => {
            document.documentElement.classList.remove("bg-background!");
            document.documentElement.style.backgroundColor = "#000";
        };
    }, []);

    // ISMOBILE EFFECT
    useEffect(() => {
        const media = window.matchMedia("(max-width: 640px)");

        function handleChange(e: MediaQueryListEvent) {
            setIsMobile(e.matches);
        };

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    // ISBIGSCREEN EFFECT
    useEffect(() => {
        const media = window.matchMedia("(min-width: 1536px)");

        function handleChange(e: MediaQueryListEvent) {
            setIsBigScreen(e.matches);
        };

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    // FETCH STOCKS EFFECT
    useEffect(() => {
        async function fetchStock() {
            const data = await StockService.getStocks();
            setStocks(data);
        };

        fetchStock();
    }, []);

    // FETCH KPIs EFFECT
    useEffect(() => {
        if (!isAdmin) return;

        async function fetchKPIs() {
            const data = await AnalyticsService.getKPIs();
            setKPIs(data);
        };

        fetchKPIs();
    }, [isAdmin, stocks]);

    // FETCH STOCK ANALYTICS EFFECT
    useEffect(() => {
        if (!isAdmin) return;

        async function fetchStockAnalytics() {
            const data = await AnalyticsService.getStockAnalytics();
            setStockAnalytics(data);
        };

        fetchStockAnalytics();
    }, [isAdmin]);

    // FETCH LAST SALES
    useEffect(() => {
        async function fetchLastSales() {
            const data = await StockService.getLastSales();
            setLastSales(data);
        };

        fetchLastSales();
    }, []);

    // FETCH AI ANALYSIS
    useEffect(() => {
        if (!isAdmin) return;

        async function fetchAIAnalysis() {
            const data = await AIService.getResponses();
            setAIAnalyses(data);
        };

        fetchAIAnalysis();
    }, [isAdmin]);

    function getRenderConditions() {
        if (isAdmin) {
            return stocks && KPIs && lastSales && stockAnalytics;
        };
        return stocks && lastSales;
    };

    if (!getRenderConditions()) return <Spinner />;
    const categories = new Set(stocks.map(product => product.product_category));

    const statusCount = stocks.reduce((acc, product) => {
        if (product.coverage_status in acc.coverage) {
            acc.coverage[product.coverage_status as "low" | "medium"]++;
            acc.changed = true;
        };

        if (product.margin_status in acc.margin) {
            acc.margin[product.margin_status as "low" | "medium"]++;
            acc.changed = true;
        };

        return acc;
    },
    {
        coverage: {
            low: 0,
            medium: 0
        },
        margin: {
            low: 0,
            medium: 0
        },
        changed: false
    });

    return (
        <>
            <Header isEdit={isEdit} setStocks={setStocks} />
            {/* USING IMPORTANT AS THE "COMPILED" CSS ISNT MAINTAINING THE ORDER */}
            {isAdmin &&
                <section className="bg-background flex flex-col items-center 2xl:items-start 2xl:grid 2xl:grid-cols-[200px_1fr_350px] 2.5xl:grid-cols-[0.2fr_1fr_0.3fr]! 3xl:grid-cols-[250px_1fr_300px]! gap-8 2.5xl:gap-10 px-2 sm:px-4 md:px-6 pt-10 sm:pt-12 md:pt-16">
                    {statusCount.changed
                        ?
                        <div className="flex flex-col gap-4">
                            <h2 className="font-main text-2xl md:text-3xl font-semibold">Alertas</h2>
                            <div className="flex flex-col gap-2">
                                {statusCount.coverage.low > 0 &&
                                    <WarnCard
                                    variant="low"
                                    data={statusCount.coverage.low}
                                    legend={statusCount.coverage.low === 1 ? "Produto com estoque crítico." : "Produtos com estoques críticos."}
                                    />
                                }
                                {statusCount.margin.low > 0 &&
                                    <WarnCard
                                    variant="low"
                                    data={statusCount.margin.low}
                                    legend={statusCount.margin.low === 1 ? "Produto com margem baixa." : "Produtos com margens baixas."}
                                    />
                                }
                                {statusCount.coverage.medium > 0 &&
                                    <WarnCard
                                    variant="medium"
                                    data={statusCount.coverage.medium}
                                    legend={statusCount.coverage.medium === 1 ? "Produto com estoque em atenção." : "Produtos com estoques em atenção."}
                                    />
                                }
                                {statusCount.margin.medium > 0 &&
                                    <WarnCard
                                    variant="medium"
                                    data={statusCount.margin.medium}
                                    legend={statusCount.margin.medium === 1 ? "Produto com margem atenção." : "Produtos com margens em atenção."}
                                    />
                                }
                            </div>
                        </div>
                        :
                        /* SPACING */
                        <div></div>
                    }
                    <KPIPanel KPIs={KPIs} stockAnalytics={stockAnalytics} isMobile={isMobile} />
                    <div className="hidden 2xl:flex flex-col items-end justify-center">
                        <UsersPanel />
                    </div>
                </section>
            }
            <main className="wrapper min-h-screen bg-background flex flex-col 2xl:grid 2xl:grid-cols-[250px_1fr] 2.5xl:grid-cols-[0.4fr_1fr_0.65fr]! 3xl:grid-cols-[250px_1fr_350px]! gap-4 2.5xl:gap-6 px-2 sm:px-4 md:px-6 pb-4 xl:pb-6">
                    {isBigScreen &&
                        <div className="flex flex-col items-start 2.5xl:items-center mt-6 sm:mt-8 md:mt-10">
                            <FilterPanel categories={categories} filters={filters} setFilters={setFilters} />
                            <div className="2.5xl:hidden mt-4">
                                <LastSalesPanel lastSales={lastSales} />
                            </div>
                        </div>
                    }
                <div className="flex justify-center sm:mt-8 md:mt-10">
                    <MainPanel stocks={stocks} setStocks={setStocks} isEdit={isEdit} setIsEdit={setIsEdit} filters={filters} setFilters={setFilters} categories={categories} />
                </div>
                <div id="right" className="hidden 2.5xl:w-full 2.5xl:flex flex-col lg:flex-row 2.5xl:flex-col! justify-start md:justify-evenly 2.5xl:justify-start! items-center lg:items-start gap-4">
                    <div className="2.5xl:w-min mt-4 sm:mt-0 2xl:mt-10">
                        <LastSalesPanel lastSales={lastSales} />
                    </div>
                </div>
            </main>
            {isAdmin && <ChatButton setIsAIOpen={setIsAIOpen} />}
            {isAdmin && isAIOpen && <AI setIsAIOpen={setIsAIOpen} AIAnalyses={AIAnalyses} setAIAnalyses={setAIAnalyses} />}
        </>
    );
};
