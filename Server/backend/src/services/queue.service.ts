import { analyticsQueue, importQueue, productQueue, snapshotQueue, stockQueue } from "../queues/queues.js";
import saveFile from "../utils/saveFile.js";
import { JOBS } from "../jobs/jobTypes.js";

export class QueueService {

    static async addImportJob(import_id: string, tenant_id: string, file: Express.Multer.File) {
        const filePath = await saveFile(file);
        console.log(filePath);
        await importQueue.add(JOBS.TRACK_IMPORT, { import_id, tenant_id, filePath });
    };

    static async addProductJob(import_id: string, tenant_id: string, filePath: string) {
        await productQueue.add(JOBS.MANAGE_PRODUCTS, { import_id, tenant_id, filePath });
    };

    static async addSnapshotJob(import_id: string, tenant_id: string, filePath: string) {
        await snapshotQueue.add(JOBS.PROCESS_SNAPSHOT, { import_id, tenant_id, filePath });
    };

    static async addStockJob(import_id: string, tenant_id: string) {
        await stockQueue.add(JOBS.REGISTER_STOCK, { import_id, tenant_id });
    };

    static async addAnalyticsJob(tenant_id: string) {
        await analyticsQueue.add(JOBS.GENERATE_ANALYTICS, tenant_id);
    };
};