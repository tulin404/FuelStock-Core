import { CircleDollarSign } from "lucide-react";
import { useState } from "react";
import type { Sale } from "../types/types";

export function LastSalesPanel({ lastSales }: { lastSales: Sale[] | null }) {
    const [limit, setLimit] = useState(5);

    return (
        <section className="p-4 bg-surface shadow-xs rounded-xl h-min sm:w-120 2xl:w-min border-2 border-border sm:hover:border-border-hover transition-colors duration-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <CircleDollarSign />
                <h2 className="text-text font-main font-semibold text-2xl">
                    Últimas vendas
                </h2>
            </div>
            <div>
                {lastSales
                    ?
                    <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-b-border text-left">
                            <th className="font-secondary font-semibold text-lg px-4 py-1 text-text">Produto</th>
                            <th className="font-secondary font-semibold text-lg px-4 py-1">
                                <span className="hidden 2xl:inline text-text">Qtd.</span>
                                <span className="inline 2xl:hidden text-text">Quantidade</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="border divide-y divide-border border-x-0">
                        {lastSales.slice(0, limit).map(sale => 
                            <tr key={sale.product_name} className="border-b-2 border-border hover:bg-surface-hover transition-colors duration-200">
                                <td className="text-text text-sm max-w-50 py-2 xl:truncate text-left" title={sale.product_name}>{sale.product_name}</td>
                                <td className="text-text text-sm max-w-50 py-2 text-center">{sale.quantity}</td>
                            </tr>)
                        }
                    </tbody>
                    </table>
                    :
                    // PURELY FALLBACK
                    <span className="text-text font-secondary whitespace-nowrap text-center w-full">Sem últimas vendas</span>
                }
                {limit < lastSales?.length && <button onClick={() => setLimit(prev => prev + 5)} className="font-secondary font-medium text-sm tracking-tight text-text-disabled hover:text-text-muted transition-colors duration-200">Ver mais...</button>}
            </div>
        </section>
    );
};