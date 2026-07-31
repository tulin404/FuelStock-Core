import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import { AnalyticsService } from "../services/analytics.service.js";
import { client } from "../db/prisma.js";

const service = new AnalyticsService(client);

export const analyticsWorker = new Worker(
    QUEUE.ANALYTICS,
    async (job) => {
        switch (job.name) {
            case JOBS.GENERATE_ANALYTICS:
                console.log("Started analyticsWorker");

                try {
                    await service.generateAnalytics();
                } catch (error) {
                    console.error(`ANALYTICS WORKER ERROR: Erro ao gerar analytics: ${error}`);
                    // RETRY
                    throw error;
                };

                break;
        }
    },
    { connection: queueConnection, concurrency: 3 }
);