// import { type Request, type Response } from "express";
// import { extractUrls, scrapeFromUrl } from "../services/urlScrape.service.js";
// import { createChunks } from "../rag/chunking.js";
// import { embedDocuments } from "../services/embedding.service.js";
// import { storeVectors } from "../services/vectorstore.service.js";
// import { findUrlDocument } from "../services/retrieval.service.js";

// export const url = async (req: Request, res: Response) => {
//   const { query } = req.body;
//   const documentIds: Record<string, string> = {};

//   const urls = extractUrls(query);

//   if (urls.length === 0) {
//     return res.status(400).json({
//       message: "No URL found in query",
//     });
//   }

//   for (let url of urls) {
//     const exisitingDocumentId = await findUrlDocument(url);
//     if (exisitingDocumentId) {
//       documentIds[url] = exisitingDocumentId;
//       continue;
//     }
//     let documentId: string = crypto.randomUUID();

//     const texts = await scrapeFromUrl(url);
//     const chunks = await createChunks(texts);
//     const vectors = await embedDocuments(chunks);
//     await storeVectors({
//       vectors,
//       chunks,
//       documentId,
//       source: url,
//       sourceType: "url",
//     });
//     documentIds[url] = documentId;
//   }

//   return res.json({
//     message: "URL indexed successfully",
//     documents: documentIds,
//     source: urls,
//   });
// };
