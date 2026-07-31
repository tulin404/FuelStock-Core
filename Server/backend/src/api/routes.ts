import { Router } from "express";
import { authRouter } from "./routes/auth.routes.js";
import { stocksRouter } from "./routes/stock.routes.js";
import { importController } from "./controllers/import.controller.js";
import { upload } from "./middlewares/upload.js";
import { importMiddleware } from "./middlewares/import.middleware.js";
import { apiRateLimit, importRateLimit } from "./middlewares/rate-limitter.middleware.js";
import { usersRouter } from "./routes/users.route.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { AIRouter } from "./routes/ai.routes.js";

export const globalRouter: Router = Router();

globalRouter.use(apiRateLimit);

globalRouter.use("/auth", authRouter);
globalRouter.use("/users", usersRouter);
globalRouter.use("/stocks", stocksRouter);
globalRouter.use("/analytics", analyticsRouter);
globalRouter.use("/ai", AIRouter);

globalRouter.post("/import", [importRateLimit, upload.single("file"), importMiddleware], importController);
