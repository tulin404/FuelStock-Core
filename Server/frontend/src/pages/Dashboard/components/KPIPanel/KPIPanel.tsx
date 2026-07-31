import type { KPIs, StockAnalytics } from "@dashboard/types/types";
import { KPICard } from "./components/KPICard";
import { currencyFormatter } from "../../helpers/formatters";
import { Chart } from "./components/Chart";

export function KPIPanel({ KPIs, stockAnalytics, isMobile }: { KPIs: KPIs, stockAnalytics: StockAnalytics[], isMobile: boolean }) {
    return (
        <section className="bg-surface w-full md:w-[80%] lg:w-full rounded-xl flex flex-col justify-center gap-6 p-6 sm:p-8 md:p-10 shadow-xs h-min border-2 border-border sm:hover:border-border-hover transition-colors duration-200">
            <h2 className="font-main text-3xl md:text-4.5xl/[1.2] font-semibold text-text text-center">Visão geral</h2>
            <div className="flex flex-col lg:flex-row gap-4 justify-center lg:items-center">
                <KPICard data={KPIs.products} legend="Produtos cadastrados" />
                <KPICard data={KPIs.monthSales} legend="Vendas nesse mês" />
                <KPICard data={currencyFormatter.format(KPIs.stockValue)} legend="Em valor de estoque" />
                <KPICard data={currencyFormatter.format(KPIs.monthProfit)} legend="Em lucro nesse mês" />
            </div>
            {/* USING STATE INSTEAD OF MEDIA QUERY FOR NOT HAVING TO LOAD TONS OF DATA SINCE MOBILE IS A MINOR VERSION */}
            {!isMobile && <Chart stockAnalytics={stockAnalytics} />}
        </section>
    );
};