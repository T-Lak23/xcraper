import { Router } from "express";
import {
  createMessage,
  getMessages,
  getDocuments,
} from "../controllers/messages.controller.js";
import { upload } from "../config/multer.js";
import { auth } from "../middlewares/auth.middleware.js";

export const messagesRouter = Router();

messagesRouter.post(
  "/:conversationId/messages",
  auth,
  upload.single("pdf"),
  createMessage,
);

messagesRouter.get("/:conversationId/messages", auth, getMessages);

messagesRouter.get("/:conversationId/messages/documents", auth, getDocuments);
