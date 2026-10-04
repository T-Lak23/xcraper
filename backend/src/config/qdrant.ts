import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env.js";

export const qdrant = new QdrantClient({
  url: env.QDRANT_CLUSTER_ENPOINT,
  apiKey: env.QDRANT_API_KEY,
});

// await qdrant.deleteCollection("documents");

// await qdrant.createCollection("documents", {
//   vectors: {
//     size: 1024,
//     distance: "Cosine",
//   },
// });

// await qdrant.createPayloadIndex("documents", {
//   field_name: "documentId",
//   field_schema: "keyword",
// });

await qdrant.createPayloadIndex("documents", {
  field_name: "source",
  field_schema: "keyword",
});

// export const retrievers = async (queryVector: number[]) => {
//   const results = await qdrant.query("documents", {
//     query: queryVector,
//     limit: 5,
//     with_payload: true,
//   });

//   const context = results?.points.map((p) => p.payload?.text).join("\n\n");

//   return context;
// };
