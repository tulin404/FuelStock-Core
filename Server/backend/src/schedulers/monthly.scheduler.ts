import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { monthlyQueue } from "../queues/queues.js";

export async function startMonthlyScheduler() {
    await monthlyQueue.upsertJobScheduler(
        QUEUE.MONTHLY,
        {
            pattern: "0 2 1 * *", // 1 DAY OF EVERY MONTH 2 AM
            tz: "America/Sao_Paulo"
        },
        {
            name: JOBS.MONTHLY_REPORT,
            data: {}
        }
    );

    console.log("[MONTHLY SCHEDULER]: Monthly scheduler started.");
};