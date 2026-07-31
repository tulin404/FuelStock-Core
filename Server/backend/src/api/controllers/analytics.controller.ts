import "dotenv/config";
import type { Request, Response } from "express";
import { client } from "../../db/prisma.js";
import { AnalyticsService } from "../../services/analytics.service.js";

const analyticsService = new AnalyticsService(client);

export class AnalyticsController {
    static async stockAnalytics(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;

        try {
            const stockAnalytics = await analyticsService.getStockAnalytics(tenant_id);
            return res.status(200).json({ data: stockAnalytics });
        } catch(error) {
            // CUSTOM ERROR MESSAGE SINCE PRISMA THROWS RAW ERROR
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(500).json({
                name: "Erro no servidor",
                message: "Não foi possível acessar as métricas de estoque.",
                debug: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };

    static async KPIs(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;

        try {
            const KPIs = await analyticsService.getKPIs(tenant_id);
            return res.status(200).json({ data: KPIs });
        } catch (error) {
            // CUSTOM ERROR MESSAGE SINCE PRISMA THROWS RAW ERROR
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(500).json({
                name: "Erro no servidor",
                message: "Não foi possível acessar as estatísticas do estoque.",
                debug: error instanceof Error ? error.message : "Erro desconhecido.",
            });
        };
    };
};
