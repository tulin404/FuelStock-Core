import type { Request, Response } from "express";
import { AIService } from "../../services/ai.service.js";
import { AnalyticsService } from "../../services/analytics.service.js";
import { client } from "../../db/prisma.js";

const aiService = new AIService(client);
const analyticsService = new AnalyticsService(client);

export class AIController {
    static async newResponse(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;
    
        try {
            const [latest] = await analyticsService.getTwoLatestMonths(tenant_id);

            // if (!latest) MEANS THAT products_monthly_sales TABLE DOES NOT HAVE ANY RECORDS,
            // WHICH MAKES THE ANALYSIS IMPOSSIBLE
            if (!latest) {
                return res.status(400).json({
                    name: "Histórico insuficiente",
                    message: "Ainda não há histórico suficiente para gerar análises inteligentes. Assim que houver pelo menos um mês de vendas, os insights estarão disponíveis."
                });
            };

            const lastResponse = await aiService.getLastResponse(tenant_id, latest.year, latest.month);

            if (lastResponse) {
                // cached METHOD ALREADY HAS IT
                return res.sendStatus(304);
            };
    
            const filteredMetrics = await analyticsService.getFilteredMetrics(tenant_id);

            // JUST A TS GUARD SINCE THIS SAME CONDITION WAS CHECKED BEFORE
            if ("insufficientHistory" in filteredMetrics) {
                return res.status(400).json({
                    name: "Histórico insuficiente",
                    message: "Ainda não há histórico suficiente para gerar análises inteligentes. Assim que houver pelo menos um mês de vendas, os insights estarão disponíveis."
                });
            };

            const analysis = await aiService.generateMonthlyAnalysis(tenant_id, filteredMetrics, filteredMetrics.timePeriod);
            const splittedDate = filteredMetrics.timePeriod.split("-");
            return res.status(200).json({
                data: {
                    year: Number(splittedDate[0]),
                    month: Number(splittedDate[1]),
                    analysis_text: analysis
                }
            });
        } catch(error) {
            // CUSTOM ERROR MESSAGE SINCE PRISMA THROWS RAW ERROR
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(500).json({
                name: "Erro ao gerar resposta",
                message: "O agente de IA falhou ao responder à chamada. Por favor, tente novamente.",
                debug: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };

    static async cached(req: Request, res: Response) {
        // try/catch BLOCK WITH findMany() FOR NOT DISPLAYING INTERNAL ERRORS FOR USERS 
        try {
            const cached = await aiService.getCached(req.user.tenant_id);
            // EVEN IF cached.length <= 0. THIS CASE WILL BE TREATED IN FRONT AND ISNT CONSIDERED AN ERROR
            return res.status(200).json({ data: cached });
        } catch (error) {
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(500).json({
                name: "Erro ao acessar análises",
                message: "Não foi possível acessar análises prévias. Por favor, tente novamente.",
                debug: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };
};