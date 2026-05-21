import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import QueueService from "../services/queue.service.js";
import StockService from "../services/stock.service.js";
import { client } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

const service = new StockService(client, Prisma);
const queueService = new QueueService();

export const stockWorker = new Worker(
    QUEUE.STOCK,
    async (job) => {
        // FUTURE JOBS
        switch(job.name) {
            case JOBS.REGISTER_STOCK:
                console.log("Started stockWorker");

                const { import_id, tenant_id } = job.data;

                try {
                    await service.syncStock(tenant_id);
                } catch (error) {
                    console.error(`STOCK WORKER ERROR: Erro ao registrar estoque do import ${import_id} do tenant ${tenant_id}: ${error}`);
                    // RETRY
                    throw error;
                };

                break;
        };
    },
    { connection: queueConnection, concurrency: 3 }
);