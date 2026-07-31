import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const analyticsRouter: Router = Router();

analyticsRouter.use([authMiddleware, isAdmin]);
analyticsRouter.get("/movements", AnalyticsController.stockAnalytics);
analyticsRouter.get("/kpis", AnalyticsController.KPIs);