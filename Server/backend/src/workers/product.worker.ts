import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import ProductService from "../services/product.service.js";
import QueueService from "../services/queue.service.js";
import { client } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { parseDailyXls } from "../utils/xls.parser.js";
import fs from "fs";

const service = new ProductService(client, Prisma);
const queueService = new QueueService();

export const productWorker = new Worker(
    QUEUE.PRODUCT,
    async (job) => {
        // FUTURE JOBS
        switch(job.name) {
            case JOBS.MANAGE_PRODUCTS:
                console.log("Started product worker");

                const { import_id, tenant_id, filePath } = job.data;

                // REPROCESS IS CHEAPER THAN QUEUE LONG JSON
                const buffer = await fs.promises.readFile(filePath);
                const parsed = parseDailyXls(buffer);
                
                try {
                    await service.upsertProducts(tenant_id, parsed.data.productData);
                } catch(error) {
                    console.error(`PRODUCT WORKER ERROR: Erro ao registrar produtos vindos do import ${import_id} do tenant ${tenant_id}: ${error}`);
                    // RETRY
                    throw error;
                };

                // ADD ANOTHER QUEUE
                queueService.addSnapshotJob(import_id, tenant_id, filePath);

                break;
        };
    },
    { connection: queueConnection, concurrency: 3 }
);