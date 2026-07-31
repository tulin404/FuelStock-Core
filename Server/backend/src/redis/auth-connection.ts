import { Redis, type RedisOptions } from "ioredis";
import "dotenv/config";

const redisURL = process.env.REDIS_AUTH_URL || "test";

const redisOptions: RedisOptions = {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: times => Math.min(times * 50, 2000),
    keepAlive: 10000
};

export const authConnection = new Redis(redisURL, redisOptions);
