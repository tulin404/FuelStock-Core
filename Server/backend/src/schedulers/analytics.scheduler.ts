import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { analyticsQueue } from "../queues/queues.js";

export async function startAnalyticsScheduler() {
    await analyticsQueue.upsertJobScheduler(
        QUEUE.ANALYTICS,
        {
            pattern: "0 1 * * *", // EVERY DAY AT 1 AM (NEEDS TO BE BEFORE THE IMPORT OF THE DAY (2 AM))
            tz: "America/Sao_Paulo"
        },
        {
            name: JOBS.GENERATE_ANALYTICS,
            data: {}
        }
    );

    console.log("[ANALYTICS SCHEDULER]: Analytics scheduler started.");
};