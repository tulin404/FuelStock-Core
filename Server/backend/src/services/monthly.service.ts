import { PrismaClient } from "../generated/prisma/client.js";
import { formatter } from "../utils/date.formatter.js";

export class MonthlyService{
    readonly #prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    #getDates() {
        const now = new Date();

        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const year = prevMonth.getFullYear();
        const month = prevMonth.getMonth();

        // LAST DAY OF PREVIOUS MONTH
        const end = new Date(year, month + 1, 0);
        // LAST DAY OF TWO MONTHS AGO
        const deleteLimit = new Date(year, month - 1, 0);

        return {
            deleteLimit: formatter.format(deleteLimit),
            end: formatter.format(end),
            year,
            month: month + 1 // +1 FOR DB FORMAT
        };
    };

    // THIS JOB ROLE:
    // 
    // FINDS LAST MONTH'S LATEST SNAPSHOT 
    // TRANFORM THIS SNAPSHOT INTO THE MONTHLY AGGREGATE
    // REMOVES ALL OF LAST MONTH'S SNAPSHOTS
    // MANTAINS ONLY THE LAST TWO MONTHS AGGREGATED (FOR AI)
    
    async generateMonthlySales() {
        const dates = this.#getDates();
        const limitYear = Number(dates.deleteLimit.split("-")[0]);
        const limitMonth = Number(dates.deleteLimit.split("-")[1]);

        const tenants = await this.#prisma.tenants.findMany();

        for (const tenant of tenants) {
            await this.#prisma.$transaction(async(tx) => {
    
                const lastDay = await tx.product_daily_sales.findFirst({
                    where: {
                        tenant_id: tenant.id,
                        date: {
                            lte: dates.end
                        }
                    },
                    orderBy: {
                        date: "desc"
                    },
                    select: {
                        date: true
                    }
                });
                
                if (!lastDay) return;
                
                const data = await tx.product_daily_sales.findMany({
                    where: {
                        tenant_id: tenant.id,
                        date: lastDay.date
                    }
                });
    
                await tx.product_monthly_sales.createMany({
                    data: data.map(item => ({
                        id: crypto.randomUUID(),
                        tenant_id: tenant.id,
                        product_id: item.product_id,
                        year: dates.year,
                        month: dates.month,
                        unit_cost: item.unit_cost,
                        unit_profit_margin: item.unit_profit_margin,
                        total_sold_qty: item.cumulative_qty,
                        total_revenue: item.cumulative_revenue,
                        total_cost: item.cumulative_cost,
                        total_profit: item.cumulative_profit
                    })),
                    skipDuplicates: true // JUST FOR SAFETY
                });
    
                await tx.product_daily_sales.deleteMany({
                    where: {
                        tenant_id: tenant.id,
                        date: {
                            lte: dates.end
                        }
                    }
                });

                await tx.product_monthly_sales.deleteMany({
                    where: {
                        tenant_id: tenant.id,
                        OR: [
                            { year: { lt: limitYear } },
                            {
                                year: limitYear,
                                month: { lte: limitMonth }
                            }
                        ]
                    }
                });
            });
        };
    };
};