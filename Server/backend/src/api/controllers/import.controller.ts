import type { Request, Response } from "express";
import ImportQueueService from "../../services/queue.service.js";
import ImportService from "../../services/import.service.js";
const queueService = new ImportQueueService();
import "dotenv/config";
import { client } from "../../db/prisma.js";
import { parseDailyXls } from "../../utils/xls.parser.js";

const service = new ImportService(client);

export async function importController(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "Bad request" });
    };

    const todayBR = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
    const exists = await service.findImportByDate(process.env.TEST_TENANT_ID!, todayBR);

    if (exists) {
        return res.status(409).json({ error: "You've already imported today" });
    };

    const importId = crypto.randomUUID();

    await queueService.addImportJob(importId, process.env.TEST_TENANT_ID!, file);
    
    return res.status(202).json(`Your import id: ${importId}`);
};