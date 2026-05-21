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



// CONNECTION TESTING

// connection.on('error', (err) => {
//   console.error('[ioredis] Error connecting to Redis:', err.message);
// });


// connection.ping()
//   .then((res) => console.log("Conexão Redis:", res))
//   .catch((err) => console.error("Erro ao conectar no Redis:", err));
