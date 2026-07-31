import "dotenv/config";
import type { Request, Response } from "express";
import { JwtService } from "../services/jwt.service.js";
import { authConnection } from "../../redis/auth-connection.js";
import { AuthService } from "../services/auth.service.js";
import { client } from "../../db/prisma.js";
import type { User, UserDTO } from "../types/types.js";
import { registerSchema } from "../schemas/auth.schema.js";

const jwtService = new JwtService(client, authConnection);
const authService = new AuthService(client);

export class AuthController {

    static async register(req: Request, res: Response) {
        const tenant_id = req.user.tenant_id;
        const { email, name, password, role } = req.body;

        const newUserDTO: UserDTO = {
            tenant_id: tenant_id.trim(),
            email: email.trim(),
            name: name.trim(),
            password: password.trim(),
            role: role.trim()
        };

        const result = registerSchema.safeParse(newUserDTO);
        
        if (!result.success) {
            return res.status(400).json({
                name: "Credenciais insuficientes",
                message: "Por favor, envie todos os dados solicitados."
            });
        };

        try {
            const newUser: User = await authService.createUser(newUserDTO);
            return res.status(201).json({ message: "Usuário criado com sucesso.", newUser });
        } catch (error) {
            return res.status(409).json({
                name: "Erro no servidor", // LESS INFO THE BETTER
                message: "Não foi possível criar o usuário."
            });
        };

    };

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                name: "Credenciais insuficientes",
                message: "Por favor, envie todos os dados solicitados."
            });
        };

        let user: User;

        try {
            user = await authService.verifyUser(email.trim(), password.trim());
        } catch (error) {
            return res.status(400).json({ message: error instanceof Error ? error.message : "Erro desconhecido." });
        };
        
        let tokens;

        try {
            tokens = await jwtService.createSession(user.id, user.tenant_id, user.role);
        } catch (error) {
            return res.status(500).json({ message: `Erro na criação dos tokens: ${error}` });
        };
        
        // HTTP ONLY REFRESH
        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.IS_HTTPS! === "true",
            sameSite: process.env.SAME_SITE as "strict" | "lax" | "none",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        
        // IN-MEMORY ACCESS
        return res.status(200).json({
            user: {
                id: user.id,
                tenant_id: user.tenant_id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken: tokens.accessToken
        });
    };

    static async refresh(req: Request, res: Response) {
        const refreshToken: string = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token não enviado." });
        };

        let tokens;

        try {
            tokens = await jwtService.refresh(refreshToken);
        } catch (error) {
            return res.status(400).json({ message: error instanceof Error ? error.message : "Erro desconhecido." })
        };

        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.IS_HTTPS! === "true",
            sameSite: process.env.SAME_SITE as "strict" | "lax" | "none",
            path: "/auth",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        // HTTP ONLY REFRESH
        return res.status(200).json({ user: tokens.user, accessToken: tokens.accessToken });
    };

    static async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refresh_token;

        try {
            await jwtService.destroySession(refreshToken);
        } catch (error) {
            return res.status(500).json({ message: "Falha ao sair." });
        };
        res.clearCookie("refresh_token");
        return res.sendStatus(204);
    };
};