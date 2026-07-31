import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AIController } from "../controllers/ai.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const AIRouter: Router = Router();

AIRouter.use([authMiddleware, isAdmin]);

AIRouter.get("/", AIController.newResponse);
AIRouter.get("/cached", AIController.cached);