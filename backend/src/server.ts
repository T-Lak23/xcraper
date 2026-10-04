import express from "express";
import cors from "cors";
import "dotenv/config";
import { uploadRouter } from "./routes/upload.route.js";
import { chatRouter } from "./routes/chat.route.js";
import { conversationsRouter } from "./routes/conversations.route.js";
import { messagesRouter } from "./routes/messages.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/user.routes.js";
import { env } from "./config/env.js";

const app = express();

(async () => {
  await connectDB();
})();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api", uploadRouter);
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
