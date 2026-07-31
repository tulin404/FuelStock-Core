import { startAnalyticsScheduler } from "./schedulers/analytics.scheduler.js";
import { startMonthlyScheduler } from "./schedulers/monthly.scheduler.js";

// MODULAR FOR POSSIBLE SCALABILITY
export async function schedulersBootstrap() {
    await startAnalyticsScheduler();
    await startMonthlyScheduler();
};