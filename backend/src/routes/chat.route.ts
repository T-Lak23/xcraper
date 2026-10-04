import { Router } from "express";
import { askQuestion } from "../controllers/chat.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
// import { url } from "../controllers/url.controller.js";

export const chatRouter = Router();

chatRouter.post("/", auth, askQuestion);
// chatRouter.post("/url", url);
