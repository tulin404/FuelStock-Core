import "dotenv/config";
import type { Request, Response } from "express";
import StockService from "../../services/stock.service.js";
import { parseStockXls } from "../../utils/xls.parser.js";
import { client } from "../../db/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

const stockService = new StockService(client, Prisma);

export async function refillController(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "Bad request" });
    };

    const stocks = parseStockXls(file.buffer);

    try {
        await stockService.addManualStock(process.env.TEST_TENANT_ID!, stocks);
    } catch (error) {
        return res.status(400).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
    };

    return res.sendStatus(200);
};