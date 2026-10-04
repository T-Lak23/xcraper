import { qdrant } from "../config/qdrant.js";
import { Document } from "../models/documents.model.js";

export const retrieveContext = async (
  queryVector: number[],
  documentIds: string[],
) => {
  try {
    const results = await qdrant.query("documents", {
      query: queryVector,
      limit: 5,
      with_payload: true,

      filter: {
        should: documentIds.map((documentId) => ({
          key: "documentId",
          match: {
            value: documentId,
          },
        })),
      },
    });

    return results.points
      .map((p) => p.payload?.text)
      .filter(Boolean)
      .join("\n\n");
  } catch (error) {
    console.log(error, { depth: null });
    throw error;
  }
};

export const findUrlDocument = async (url: string, conversationId: string) => {
  const document = await Document.findOne({
    conversationId,
    source: url,
    sourceType: "url",
  }).select("_id");

  // const results = await qdrant.scroll("documents", {
  //   filter: {
  //     must: [
  //       {
  //         key: "source",
  //         match: {
  //           value: url,
  //         },
  //       },
  //     ],
  //   },
  //   limit: 1,
  //   with_payload: true,
  // });

  // const point = results.points[0];

  // return (point?.payload?.documentId as string) ?? null;

  return document?._id.toString() ?? null;
};
