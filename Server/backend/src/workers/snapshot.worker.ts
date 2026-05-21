import { Worker } from "bullmq";
import { QUEUE } from "../queues/queueTypes.js";
import { JOBS } from "../jobs/jobTypes.js";
import { queueConnection } from "../redis/queue-connection.js";
import SnapshotService from "../services/snapshot.service.js";
import QueueService from "../services/queue.service.js";
import { client } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { parseDailyXls } from "../utils/xls.parser.js";
import fs from "fs";
import ImportService from "../services/import.service.js";

const service = new SnapshotService(client, Prisma);
const importService = new ImportService(client);
const queueService = new QueueService();

export const snapshotWorker = new Worker(
    QUEUE.SNAPSHOT,
    async (job) => {
        // FUTURE JOBS
        switch(job.name) {
            case JOBS.PROCESS_SNAPSHOT:
                console.log("Started snapshotWorker");

                const { import_id, tenant_id, filePath } = job.data;

                const buffer = await fs.promises.readFile(filePath);
                const parsed = parseDailyXls(buffer);
                await fs.promises.unlink(filePath);
                
                try {
                    await service.createSnapshotAndDaily(import_id, tenant_id, parsed.data.productData);
                    await importService.updateImportStatus(import_id, "PROCESSED");
                } catch(error) {
                    await importService.updateImportStatus(import_id, "CANCELED");
                    console.error(`SNAPSHOT WORKER ERROR: Erro ao criar snapshot do import ${import_id} do tenant ${tenant_id}: ${error}`);
                    // RETRY
                    throw error;
                };

                // ADD ANOTHER QUEUE
                await queueService.addStockJob(import_id, tenant_id);

                break;
        };
    },
    { connection: queueConnection, concurrency: 3 }
);