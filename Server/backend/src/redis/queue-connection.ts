import { Redis, type RedisOptions } from "ioredis";
import "dotenv/config";

const redisURL = process.env.REDIS_QUEUE_URL || "test";

const redisOptions: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: times => Math.min(times * 100, 5000),
    keepAlive: 30000
};

export const queueConnection = new Redis(redisURL, redisOptions);
