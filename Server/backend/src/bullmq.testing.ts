// async function logJob() {
//     const job = await importQueue.getJob("1");

import { JOBS } from "./jobs/jobTypes.js";
import { analyticsQueue } from "./queues/queues.js";

//     if (!job) {
//         console.log("No job with this id");
//         return;
//     };
    
//     // await job.remove();
//     console.log(job);
// };

// async function countJobs() {
//     const counts = await importQueue.getJobCounts();
//     console.log(counts);
// };

// await countJobs();
// 
async function test() {
    await analyticsQueue.add(JOBS.GENERATE_ANALYTICS, {});
    console.log("ok");
};

await test();