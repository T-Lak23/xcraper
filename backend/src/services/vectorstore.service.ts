import { qdrant } from "../config/qdrant.js";

interface StoreVectorsParams {
  documentId: string;
  source: string;
  sourceType: "pdf" | "url";
  pageCount?: number;
  vectors: number[][];
  chunks: string[];
}

export const storeVectors = async ({
  documentId,
  source,
  sourceType,
  pageCount,
  vectors,
  chunks,
}: StoreVectorsParams) => {
  await qdrant.upsert("documents", {
    wait: true,

    points: vectors.map((vector, index) => ({
      id: crypto.randomUUID(),

      vector,

      payload: {
        documentId,
        source,
        sourceType,
        pageCount,
        chunkIndex: index,
        text: chunks[index],
        uploadedAt: new Date().toISOString(),
      },
    })),
  });
};
