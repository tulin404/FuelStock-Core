import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import { MonthlyService } from "../services/monthly.service.js";
import { client } from "../db/prisma.js";

const service = new MonthlyService(client);

export const monthlyWorker = new Worker(
    QUEUE.MONTHLY,
    async (job) => {
        switch(job.name) {
            case JOBS.MONTHLY_REPORT:
                console.log("Started monthly worker");

                await service.generateMonthlySales();
        };
    },
    { connection: queueConnection, concurrency: 1 }
);