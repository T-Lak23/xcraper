import { Router } from "express";
import { upload } from "../config/multer.js";
import { uploadFile } from "../controllers/upload.controller.js";

export const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("pdf"), uploadFile);
