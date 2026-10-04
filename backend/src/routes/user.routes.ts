import { Router } from "express";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

authRouter.post("/logout", auth, logout);
authRouter.get("/me", auth, getCurrentUser);
