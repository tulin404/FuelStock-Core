import { Queue } from "bullmq"
import { QUEUE } from "./queueTypes.js"
import { queueConnection } from "../redis/queue-connection.js"

export const importQueue = new Queue(QUEUE.IMPORT, {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: 1000
    }
});

export const productQueue = new Queue(QUEUE.PRODUCT, {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: 1000
    }
});

export const snapshotQueue = new Queue(QUEUE.SNAPSHOT, {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: 1000
    }
});

export const stockQueue = new Queue(QUEUE.STOCK, {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: 1000
    }
});