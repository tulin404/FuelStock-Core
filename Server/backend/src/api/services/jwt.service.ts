import type { RedisClient } from "bullmq";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { AccessTokenDTO, AccessTokenPayload, RedisSession, RefreshTokenDTO, RefreshTokenPayload, User } from "../types/types.js";
import argon2 from "argon2";
import type { Roles } from "../../generated/prisma/enums.js";
import type { PrismaClient } from "../../generated/prisma/client.js";

export class JwtService {
    readonly #prisma;
    readonly #redis;

    constructor(prisma: PrismaClient, redis: RedisClient) {
        this.#prisma = prisma;
        this.#redis = redis;
    };

    // LOGIN
    async createSession(user_id: string, tenant_id: string, role: Roles) {
        const sid = crypto.randomUUID();

        const accessDTO: AccessTokenDTO = {
            user_id,
            tenant_id,
            sid,
            role
        };

        const accessToken = this.#createAccessToken(accessDTO);
    
        const refreshDTO: RefreshTokenDTO = {
            sid,
            user_id
        };

        const refreshToken = this.#createRefreshToken(refreshDTO);

        await this.#upsertRefreshToken(refreshToken, refreshDTO);
    
        return {
            accessToken,
            refreshToken
        };
    };

    #createAccessToken({ user_id, tenant_id, sid, role }: AccessTokenDTO) {
        const secret = process.env.ACCESS_SECRET!;

        // IAT AND EXP ARE AUTOMATIC
        const payload: AccessTokenPayload = {
            sub: user_id,
            tenant_id,
            sid,
            role,
            type: "access"
        };

        const options: SignOptions = {
            expiresIn: "30m"
        };

        return jwt.sign(payload, secret, options);
    };

    // SUB FOR GOOD REDUNDANCY
    #createRefreshToken({ user_id, sid }: RefreshTokenDTO) {
        const secret = process.env.REFRESH_SECRET!;

        const payload: RefreshTokenPayload = {
            sub: user_id,
            sid,
            type: "refresh"
        };

        const options: SignOptions = {
            expiresIn: "7d"
        };

        return jwt.sign(payload, secret, options);
    };

    // DTO FOR NOT HAVING TO DECODE THE TOKEN
    async #upsertRefreshToken(refreshToken: string, { user_id, sid }: RefreshTokenDTO) {
        const key = `session:${sid}`;

        const existingRaw = await this.#redis.get(key);
        
        let created_at: number;
        
        if (existingRaw) {
            const existing: RedisSession = JSON.parse(existingRaw);
            created_at = existing.created_at;
        } else {
            created_at = Date.now();
        };

        const refresh_hash = await argon2.hash(refreshToken);

        const redisPayload: RedisSession = {
            user_id,
            refresh_hash,
            created_at
        };

        await this.#redis.set(key, JSON.stringify(redisPayload), "EX", 60 * 60 * 24 * 7);
    };

    // ROTATION
    async refresh(refreshToken: string) {
        const decoded = JwtService.verifyRefresh(refreshToken);
        
        if (!JwtService.isRefreshTokenPayload(decoded)) {
            throw new Error("Token incompleto ou inválido.");
        };

        const key = `session:${decoded.sid}`;
        const exists = await this.#redis.get(key);

        if (!exists) {
            throw new Error("Sessão inválida.");
        };

        const user = await this.#prisma.users.findUnique({
            where: { id: decoded.sub }, 
            select: { id: true, tenant_id: true, name: true, email: true, role: true }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        };

        const refreshDTO: RefreshTokenDTO = {
            sid: decoded.sid,
            user_id: user.id
        };

        const newRefresh = this.#createRefreshToken(refreshDTO);
        // ROTATE REFRESH
        await this.#upsertRefreshToken(newRefresh, refreshDTO);

        const accessDTO: AccessTokenDTO = {
            user_id: user.id,
            tenant_id: user.tenant_id,
            sid: decoded.sid,
            role: user.role
        };

        const newAccess = this.#createAccessToken(accessDTO);

        return {
            user,
            accessToken: newAccess,
            refreshToken: newRefresh
        };
    };

    destroySession(refreshToken: string) {
        const decoded = JwtService.verifyRefresh(refreshToken);

        if (!JwtService.isRefreshTokenPayload(decoded)) {
            throw new Error("Token incompleto ou inválido.");
        };

        const key = `session:${decoded.sid}`;

        const deleted = this.#redis.del(key);
        return deleted;
    };

    static verifyAccess(token: string) {
        const secret = process.env.ACCESS_SECRET!;
        return jwt.verify(token, secret);
    };

    static verifyRefresh(token: string) {
        const secret = process.env.REFRESH_SECRET!;
        return jwt.verify(token, secret);
    };

    static isAccessTokenPayload(payload: string | JwtPayload): payload is AccessTokenPayload {
        return (
            typeof payload === "object" &&
            payload !== null &&
            "sub" in payload &&
            "sid" in payload &&
            "tenant_id" in payload &&
            "role" in payload &&
            "type" in payload &&
            payload.type === "access"
        );
    };

    static isRefreshTokenPayload(payload: string | JwtPayload): payload is RefreshTokenPayload {
        return (
            typeof payload === "object" &&
            payload !== null &&
            "sub" in payload &&
            "sid" in payload &&
            "type" in payload &&
            payload.type === "refresh"
        );
    };
};