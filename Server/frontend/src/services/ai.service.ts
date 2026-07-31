import { ApiError } from "@/utils/ApiError";
import { jwtFetch } from "@/utils/jwtFetch";

export class AIService {
    //AIAnalysis ARE VITAL SO NO ERROR CHECK
    static async getResponses() {
        const raw = await jwtFetch("api/ai/cached", {
            credentials: "include"
        });
        const parsed = await raw.json();
        return parsed.data.reverse();
    };

    static async generateAnalysis() {
        const raw = await jwtFetch("api/ai", {
            credentials: "include"
        });
        const response = await raw.json();

        if (!raw.ok) {
            throw new ApiError(response.message, response.name);
        };

        return response.data;
    };
};