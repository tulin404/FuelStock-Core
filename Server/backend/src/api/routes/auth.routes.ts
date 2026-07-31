import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
import { loginRateLimit, registerRateLimit } from "../middlewares/rate-limitter.middleware.js";

export const authRouter: Router = Router();

authRouter.post("/register", [registerRateLimit, authMiddleware], AuthController.register);
authRouter.post("/login", [loginRateLimit], AuthController.login);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);