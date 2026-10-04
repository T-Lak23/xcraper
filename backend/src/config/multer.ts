import multer, { type FileFilterCallback } from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!") as any, false);
    }
  },
});
