import "dotenv/config";
import type { Request, Response } from "express";
import { QueueService } from "../../services/queue.service.js";
import { ImportService } from "../../services/import.service.js";
import { client } from "../../db/prisma.js";
import { formatter } from "../../utils/date.formatter.js";

const importService = new ImportService(client);

export async function importController(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Sem file na request." });
    };

    const todayBR = formatter.format(new Date());

    const exists = await importService.findImportByDate(req.body.tenant_id, todayBR);

    if (exists) {
        return res.status(409).json({
            // DEBUG LOG
            name: "Importação bloquada",
            message: "Você já importou hoje."
        });
    };

    const importId = crypto.randomUUID();

    try {
        await QueueService.addImportJob(importId, req.body.tenant_id, file);
    } catch(error) {
        res.status(500).json({
            // DEBUG LOG
            name: "Falha ao adicionar job de importação",
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    };
    
    return res.status(202).json({ message: `Seu ID de importação: ${importId}` });
};