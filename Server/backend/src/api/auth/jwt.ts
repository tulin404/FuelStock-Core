import type { RedisClient } from "bullmq";
import jwt from "jsonwebtoken";

export default class JwtHandler {
    readonly #redis;

    constructor(redis: RedisClient) {
        this.#redis = redis;
    };

    createAccessToken() {

    };

    verifyJwt(token: string, secret: string) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            throw new Error("Token inválido ou expirado");
        };
    };
}