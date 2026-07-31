import type { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;

    if (role !== "admin") {
        return res.status(401).json({ message: "Acesso negado." });
    };

    return next();
};