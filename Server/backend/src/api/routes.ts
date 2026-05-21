import { Router } from "express";
import { importController } from "./controllers/import.controller.js";
import { refillController } from "./controllers/refill.controller.js";
import { upload } from "./middlewares/upload.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

export const globalRouter: Router = Router();

globalRouter.post("/import", upload.single("file"), importController);

globalRouter.post("/stock/refill", upload.single("file"), refillController);