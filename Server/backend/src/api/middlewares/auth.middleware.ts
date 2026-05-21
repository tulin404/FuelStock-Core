import type { Request, Response, NextFunction } from "express";
import JwtHandler from "../auth/jwt.js";
import { isAccessTokenPayload } from "../auth/guard.js";
import { authConnection } from "../../redis/auth-connection.js";

const handler = new JwtHandler(authConnection);
const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No Token" });
    };

    const [, token] = authHeader.split(" ");

    if (!token) {
        return res.status(401).json({ error: "No token" });
    };

    try {
        const decoded = handler.verifyJwt(token, JWT_SECRET);

        if (!isAccessTokenPayload(decoded)) {
            throw new Error("Token incompleto ou inválido");
        };

        if (!decoded.sub || !decoded.tenant_id) {
            return res.status(401).json({ error: "Token incompleto ou inválido" });
        };

        req.user = {
            id: decoded.sub,
            tenant_id: decoded.tenant_id,
        };

        return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    };
};