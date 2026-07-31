import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.js";
import { StockController } from "../controllers/stock.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const stocksRouter: Router = Router();

stocksRouter.use(authMiddleware);

stocksRouter.post("/refill", [upload.single("file")], StockController.refill);
stocksRouter.patch("/adjust", StockController.adjust);
stocksRouter.delete("/delete/:product_id", [isAdmin], StockController.delete);

stocksRouter.get("/", StockController.getStocks);
stocksRouter.get("/sales", StockController.getSales);