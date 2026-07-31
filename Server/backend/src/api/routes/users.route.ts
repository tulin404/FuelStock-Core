import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UsersController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const usersRouter: Router = Router();

usersRouter.use([authMiddleware, isAdmin]);

usersRouter.get("/", UsersController.getUsers);
usersRouter.delete("/delete/:user_id", UsersController.delete);