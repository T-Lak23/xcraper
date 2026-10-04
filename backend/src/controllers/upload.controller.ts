import { type Request, type Response } from "express";
import { extractPdfText } from "../services/pdf.service.js";
import { createChunks } from "../rag/chunking.js";
import { embedDocuments } from "../services/embedding.service.js";
import { storeVectors } from "../services/vectorstore.service.js";

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: "PDF required",
    });
  }

  const documentId = crypto.randomUUID();

  const pdf = await extractPdfText(file.buffer);

  const chunks = await createChunks(pdf.text);

  const vectors = await embedDocuments(chunks);

  await storeVectors({
    vectors,
    chunks,
    documentId,
    source: file.originalname,
    sourceType: "pdf",
    pageCount: pdf.total,
  });

  return res.json({
    message: "Indexed successfully",
    documentId,
    fileName: file.originalname,
  });
};
