import { Router } from "express";
import {
  createConversation,
  getConversations,
} from "../controllers/conversations.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const conversationsRouter = Router();

conversationsRouter.post("/", auth, createConversation);
conversationsRouter.get("/", auth, getConversations);
