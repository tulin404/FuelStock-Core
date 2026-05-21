import { importQueue } from "./queues/queues.js";

async function logJob() {
    const job = await importQueue.getJob("1");

    if (!job) {
        console.log("No job with this id");
        return;
    };
    
    // await job.remove();
    console.log(job);
};

async function countJobs() {
    const counts = await importQueue.getJobCounts();
    console.log(counts);
};

await countJobs();