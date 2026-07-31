import { Request } from "express";
import type { Roles } from "../../../generated/prisma/enums.ts";

declare global {
    namespace Express {
        interface Request {
            user: {
                sid: string,
                id: string;
                tenant_id: string;
                role: Roles
            };
        }
    }
}

export {};