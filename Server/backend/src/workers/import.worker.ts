import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import ImportService from "../services/import.service.js";
import QueueService from "../services/queue.service.js";
import { client } from "../db/prisma.js";

const service = new ImportService(client);
const queueService = new QueueService();

export const importWorker = new Worker(
    QUEUE.IMPORT,
    async (job) => {
        // FUTURE JOBS
        switch(job.name) {
            case JOBS.TRACK_IMPORT:
                console.log("Started importWorker");

                const { import_id, tenant_id, filePath } = job.data;

                try {
                    await service.handleImport(import_id, tenant_id);
                } catch(error) {
                    console.error(`IMPORT WORKER ERROR: Erro no import ${import_id} do tenant ${tenant_id}: ${error}`);
                    // RETRY
                    throw error;
                }

                // ADD ANOTHER QUEUE
                await queueService.addProductJob(import_id, tenant_id, filePath);

                break;
        };
    },
    { connection: queueConnection, concurrency: 3 }
);