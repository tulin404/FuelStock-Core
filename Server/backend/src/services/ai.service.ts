import "dotenv/config";
import type { FilteredMetrics } from "../types/types.js";
import type { PrismaClient } from "../generated/prisma/client.js";

export class AIService {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    };

    #buildMonthlyPrompt(filteredMetrics: FilteredMetrics) {
        return `
            Você é um analista especialista em varejo, vendas e desempenho de produtos.
            
            Seu objetivo é gerar uma análise estratégica baseada em dados de produtos, identificando padrões relevantes, oportunidades, riscos e pontos de atenção para o negócio.
            
            Escreva em português do Brasil.
            
            O tom deve ser:
            - profissional
            - analítico
            - objetivo
            - claro
            
            A análise deve:
            - conter o mês analisado
            - destacar produtos com queda relevante de desempenho
            - identificar oportunidades de crescimento e melhoria
            - apontar produtos com margem reduzida ou potencial de otimização
            - identificar possíveis riscos operacionais ou comerciais
            - priorizar os insights de maior impacto
            
            Evite:
            - conclusões genéricas
            - recomendações sem relação com os dados apresentados
            - repetição excessiva de números
            - explicações óbvias sem valor analítico
            
            Priorize:
            - tendências importantes
            - variações significativas
            - comparações relevantes
            - possíveis causas dos resultados
            - ações práticas baseadas nos dados
            
            Estruture a resposta em:
            
            ## Resumo geral
            Apresente uma visão consolidada do desempenho analisado.
            
            ## Principais alertas
            Liste os pontos que exigem atenção, explicando o impacto potencial.
            
            ## Oportunidades
            Identifique produtos, categorias ou comportamentos que podem representar crescimento.
            
            ## Recomendações práticas
            Sugira ações objetivas baseadas nos insights encontrados.

            OBS: É expressamente proibido recomendar sistemas de tracking ou alertar sobre falta de histórico, pois isso já está implementado. Além disso, os dados que você receberá saem direto do banco de dados e possuem chaves em inglês, mas não fale sobre termos de código e formate corretamente o nome dos produtos.
            
            DADOS:
            ${JSON.stringify(filteredMetrics)}
        `;
    };

    async #makeAIRequest(prompt: string) {
        let raw = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY!
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!raw.ok) {
            // FALLBACK FOR 2.5
            raw = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": process.env.GEMINI_API_KEY!
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                }
            );
        };
        
        if (!raw.ok) {
            // IF THE TWO MODELS FAIL
            const debug = await raw.text();
            throw new Error(debug);
        };

        const data = await raw.json();

        const insight: string = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!insight) {
            throw new Error("Empty AI response.")
        };

        return insight;
    };

    async #cacheResponse(tenant_id: string, AIResponse: string, dates: string) {
        const splitted = dates.split("-");

        const year = Number(splitted[0]);
        const month = Number(splitted[1]);

        if (!year || !month) {
            throw new Error("No year or no month");
        };

        await this.#prisma.ai_monthly_analyses.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id,
                year: Number(year),
                month: Number(month),
                analysis_text: AIResponse
            }
        });
    };

    getLastResponse(tenant_id: string, year: number, month: number) {
        return this.#prisma.ai_monthly_analyses.findFirst({
            select: { analysis_text: true, year: true, month: true },
            where: { tenant_id, year, month },
            orderBy: [
                { year: "desc" },
                { month: "desc" }
            ]
        });
    };

    async generateMonthlyAnalysis(tenant_id: string, filteredMetrics: FilteredMetrics, dates: string) {
        const prompt = this.#buildMonthlyPrompt(filteredMetrics);

        const data = await this.#makeAIRequest(prompt);
        await this.#cacheResponse(tenant_id, data, dates);

        return data;
    };

    getCached(tenant_id: string) {
        return this.#prisma.ai_monthly_analyses.findMany({
            select: { analysis_text: true, year: true, month: true },
            where: { tenant_id }
        });
    };
};