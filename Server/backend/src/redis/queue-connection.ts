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



// CONNECTION TESTING

// connection.on('error', (err) => {
//   console.error('[ioredis] Error connecting to Redis:', err.message);
// });


// connection.ping()
//   .then((res) => console.log("Conexão Redis:", res))
//   .catch((err) => console.error("Erro ao conectar no Redis:", err));
