import { StockService } from "../../services/stock.service.js";
import z from "zod";
import { client } from "../../db/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { adjustSchema } from "../schemas/adjust.schema.js";
import { refillSchema } from "../schemas/refill.schema.js";
import { parseStockXls } from "../../utils/xls.parser.js";
import type { Request, Response } from "express";
import type { StockProduct } from "../../types/types.js";

const stockService = new StockService(client, Prisma);

export class StockController {
    static async adjust(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;
        const productsList: StockProduct[] = req.body.products;

        const result = adjustSchema.safeParse(productsList);

        if (!result.success) {
            return res.status(400).json({
                name: "Formato inválido",
                message: "Formato de dados inválido na planilha."
            });
        };

        try {
            await stockService.addAjustment(tenant_id, result.data);
        } catch (error) {
            // CUSTOM ERROR MESSAGE SINCE PRISMA THROWS RAW ERROR
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(400).json({
                name: "Erro ao ajustar estoque",
                message: "Não foi possível ajustar o estoque. Por favor, tente novamente.",
                debug: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };

        return res.status(200).json({ message: "Ajuste criado!" });
    };

    static async refill(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                name: "Arquivo ausente",
                message: "Por favor, envie um arquivo .xls"
            });
        };

        const stocks = parseStockXls(file.buffer);
    
        try {
            refillSchema.parse(stocks);
            await stockService.addManualStock(tenant_id, stocks);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    name: "Formato inválido",
                    message: "Formato de dados inválido na planilha.",
                    errors: z.treeifyError(error) // TREATMENT ON FRONTEND
                });
            };

            return res.status(500).json({
                name: "Erro no servidor",
                message: error instanceof Error ? error.message : "Erro desconhecido"
            });
        };

        return res.status(200).json({ message: "Estoque adicionado" });
    };

    static async delete(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;
        const product_id = String(req.params.product_id);

        try {
            await stockService.deleteProduct(tenant_id, product_id);
        } catch (error) {
            return res.status(400).json({
                name: "Falha ao deletar produto",
                message: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };

        return res.status(200).json({ message: "Produto deletado." });
    };

    static async getStocks(req: Request, res: Response) {
        try {
            const stocks = await stockService.getStocks(req.user.tenant_id);
            return res.status(200).json({ data: stocks });
        } catch (error) {
            return res.status(500).json({
                name: "Falha ao buscar estoques",
                message: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };

    static async getSales(req: Request, res: Response) {
        try {
            const sales = await stockService.getLastSales(req.user.tenant_id);
            return res.status(200).json({ data: sales });
        } catch (error) {
            return res.status(500).json({
                name: "Falha ao buscar últimas vendas",
                message: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };
};