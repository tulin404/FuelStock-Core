import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No auth header" });
    };

    const [, token] = authHeader.split(" ");

    if (!token) {
        return res.status(401).json({ error: "No token" });
    };

    try {
        const decoded = JwtService.verifyAccess(token);

        if (!JwtService.isAccessTokenPayload(decoded)) {
            return res.status(401).json({ error: "Token incompleto ou inválido" }); // LESS INFO THE BETTER
        };

        req.user = {
            sid: decoded.sid,
            id: decoded.sub,
            tenant_id: decoded.tenant_id,
            role: decoded.role
        };

        return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    };
};