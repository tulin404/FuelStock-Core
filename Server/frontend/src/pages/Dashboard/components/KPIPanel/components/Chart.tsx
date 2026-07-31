import { useState } from "react";
import type { StockAnalytics, StockAnalyticsRange } from "@dashboard/types/types";
// import { CustomTooltip } from "./CustomTooltip";
import { ChartDropDown } from "./ChartDropdown";
import { AnalyticsService } from "@/services/analytics.service";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { numberFormatter } from "@/pages/Dashboard/helpers/formatters";

export function Chart({ stockAnalytics }: { stockAnalytics: StockAnalytics[] }) {
    const [range, setRange] = useState<StockAnalyticsRange>("7d");

    function getAvailableRanges() {
        const available: StockAnalyticsRange[] = [];

        if (stockAnalytics.length >= 7) available.push("7d");
        if (stockAnalytics.length >= 30) available.push("30d");
        if (stockAnalytics.length >= 90) available.push("90d");
        if (stockAnalytics.length >= 365) available.push("365d");

        return available;
    };

    if (getAvailableRanges().length <= 0) {
        return (
            <div className="w-full rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-200">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h3 className="font-main text-2xl sm:text-2.5xl font-semibold text-text">Movimentação de estoque</h3>
                        <p className="font-secondary mt-1 text-sm text-text-muted">Entradas e saídas ao longo do período</p>
                    </div>
                </div>
                <div>
                    <p className="font-main text-2xl sm:text-3xl text-center">Movimentações indisponíveis no momento.</p>
                </div>
            </div>
        );
    };

    const preparedAnalytics = AnalyticsService.prepareChartData(stockAnalytics, range);

    return (
        <div className="w-full rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md sm:hover:border-border-hover transition-all duration-200">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row items-start justify-between">
                <div>
                    <h3 className="font-main text-2xl sm:text-2.5xl font-semibold text-text">Movimentação de estoque</h3>
                    <p className="font-secondary mt-1 text-sm text-text-muted">Entradas e saídas ao longo do período</p>
                </div>
                <ChartDropDown range={range} setRange={setRange} availableRanges={getAvailableRanges()} />
            </div>

            <ResponsiveContainer width="100%" height={380}>
                <LineChart
                    data={preparedAnalytics}
                    margin={{
                        top: 25,
                        right: 35,
                        left: 5,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="chartBackground"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--color-primary)"
                                stopOpacity={0.03}
                            />
            
                            <stop
                                offset="100%"
                                stopColor="var(--color-primary)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        horizontal
                        vertical
                        stroke="var(--color-border)"
                        strokeDasharray="4 4"
                        opacity={0.6}
                    />
            
                    <XAxis
                        dataKey="date"
                        interval={range === "7d" ? 0 : undefined}
                        tickMargin={12}
                        tick={{
                            fill: "#8b8b8b",
                            fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={false}
                    />
            
                    <YAxis
                        width={55}
                        tickFormatter={(value) => 
                            numberFormatter.format(Number(value))
                        }
                        tickMargin={8}
                        tick={{
                            fill: "#8b8b8b",
                            fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={false}
                    />
            
                    <Tooltip
                        cursor={{
                            stroke: "var(--color-primary)",
                            strokeWidth: 1,
                            strokeDasharray: "4 4",
                        }}
                        formatter={(value) => 
                            numberFormatter.format(Number(value))
                        }
                        contentStyle={{
                            borderRadius: 16,
                            border: "1px solid var(--color-border)",
                            background: "rgba(255,255,255,.92)",
                            backdropFilter: "blur(12px)",
                            boxShadow:
                                "0 12px 32px rgba(0,0,0,.10)",
                        }}
                    />
            
                    <Line
                        type="monotone"
                        dataKey="stock_in"
                        name="Entradas"
                        stroke="var(--color-success)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dot={false}
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            stroke: "#fff",
                            fill: "var(--color-success)",
                        }}
                    />
            
                    <Line
                        type="monotone"
                        dataKey="stock_out"
                        name="Saídas"
                        stroke="var(--color-danger)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dot={false}
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            stroke: "#fff",
                            fill: "var(--color-danger)",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};