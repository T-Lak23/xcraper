import { z } from "zod";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["application/pdf"];

export const pdfUploadSchema = z.object({
  originalname: z
    .string()
    .endsWith(".pdf", { message: "File name must end with .pdf" }),
  mimetype: z.string().refine((type) => ACCEPTED_MIME_TYPES.includes(type), {
    message: "Only PDF files are allowed",
  }),
  size: z
    .number()
    .max(MAX_FILE_SIZE, { message: "File size must be less than 5MB" }),
  buffer: z.instanceof(Buffer, { message: "File buffer is required" }),
});
