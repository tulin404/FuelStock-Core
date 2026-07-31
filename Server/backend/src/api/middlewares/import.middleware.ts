import type { Request, Response, NextFunction } from "express";
// NO DEP INJECTION IN THIS CASE
import { client } from "../../db/prisma.js";

export async function importMiddleware(req: Request, res: Response, next: NextFunction) {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "Sem arquivo de importação." });
    };

    const tenant_id: string = req.body.tenant_id;

    if (!tenant_id) {
        return res.status(400).json({ error: "Sem ID do tenant." });
    };

    const exists = await client.tenants.findUnique({ where: { id: tenant_id } });

    if (!exists) {
        return res.status(400).json({ error: "Tenant inexistente." });
    };

    return next();
};