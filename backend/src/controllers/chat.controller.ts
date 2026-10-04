// import { type Request, type Response } from "express";
// // import { embedQuery } from "../services/embedding.service.js";
// // import { retrieveContext } from "../services/retrieval.service.js";
// // import { generateAnswer } from "../services/chat.service.js";
// import { chatGraph } from "../graph/graph.js";
// import { extractUrls, removeUrls } from "../services/urlScrape.service.js";
// import { Conversation } from "../models/conversations.model.js";
// import { Document } from "../models/documents.model.js";
// import { getConversationMessages } from "../services/messages.service.js";
// import { Message } from "../models/messages.model.js";

// export const askQuestion = async (req: Request, res: Response) => {
//   const { query, conversationId, messageId } = req.body;

//   const userId = req.user?._id;

//   if (!userId) {
//     return res.status(401).json({
//       message: "Unauthorized",
//     });
//   }

//   const conversation = await Conversation.findOne({
//     _id: conversationId,
//     userId,
//   });

//   if (!conversation) {
//     return res.status(404).json({
//       message: "Conversation not found",
//     });
//   }

//   const documents = await Document.find({
//     conversationId: conversation._id,
//   }).select("_id");

//   const documentIds = documents.map((document) => document._id.toString());

//   const cleanedQuery = removeUrls(query);
//   const urls = extractUrls(query);

//   const messages = await getConversationMessages(conversation._id.toString());
//   const recentMessages = messages.slice(-4);

//   // if (!messageId) {
//   //   await Message.create({
//   //     conversationId: conversation._id,
//   //     content: cleanedQuery,
//   //     role: "human",
//   //   });
//   // }
//   // const result = await chatGraph.invoke({
//   //   question: cleanedQuery,
//   //   documentIds: documentIds ?? [],
//   //   urls: urls,
//   //   conversationId: conversation._id.toString(),
//   //   messages: messages,
//   // });

//   // await Message.create([
//   //   {
//   //     conversationId: conversation._id,
//   //     content: cleanedQuery,
//   //     role: "human",
//   //   },
//   //   {
//   //     conversationId: conversation._id,
//   //     content: result.answer,
//   //     role: "ai",
//   //   },
//   // ]);

//   // return res.json({
//   //   answer: result.answer,
//   // });

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache, no-transform");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   const abortController = new AbortController();
//   res.on("close", () => abortController.abort()); // stop if client disconnects

//   let fullAnswer = "";

//   try {
//     const stream = await chatGraph.stream(
//       {
//         question: cleanedQuery,
//         documentIds: documentIds ?? [],
//         urls: urls,
//         conversationId: conversation._id.toString(),
//         messages: recentMessages,
//       },
//       { streamMode: "messages", signal: abortController.signal },
//     );

//     for await (const [messageChunk, metadata] of stream) {
//       // only stream the final answer node, not the router's LLM call
//       if (metadata.langgraph_node !== "generate") continue;

//       const token =
//         typeof messageChunk.content === "string" ? messageChunk.content : "";
//       if (!token) continue;

//       fullAnswer += token;
//       res.write(`data: ${JSON.stringify({ token })}\n\n`);
//     }

//     // save to DB once streaming is complete

//     const aiMessage = await Message.create({
//       conversationId: conversation._id,
//       content: fullAnswer,
//       role: "ai",
//     });

//     res.write(
//       `event: done\ndata: ${JSON.stringify({
//         message: aiMessage,
//       })}\n\n`,
//     );
//   } catch (err) {
//     console.error("STREAM ERROR:", err);
//     if (!abortController.signal.aborted) {
//       res.write(
//         `event: error\ndata: ${JSON.stringify({ message: "Stream failed" })}\n\n`,
//       );
//     }
//   } finally {
//     res.end();
//   }
// };

import { type Request, type Response } from "express";
import { chatGraph } from "../graph/graph.js";
import { extractUrls, removeUrls } from "../services/urlScrape.service.js";
import { Conversation } from "../models/conversations.model.js";
import { Document } from "../models/documents.model.js";
import { getConversationMessages } from "../services/messages.service.js";
import { Message } from "../models/messages.model.js";

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { query, conversationId } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const documents = await Document.find({
      conversationId: conversation._id,
    }).select("_id");

    const documentIds = documents.map((document) => document._id.toString());

    const cleanedQuery = removeUrls(query);
    const urls = extractUrls(query);

    const messages = await getConversationMessages(conversation._id.toString());

    const recentMessages = messages.slice(-4);

    const result = await chatGraph.invoke({
      question: cleanedQuery,
      documentIds,
      urls,
      conversationId: conversation._id.toString(),
      messages: recentMessages,
    });

    const aiMessage = await Message.create({
      conversationId: conversation._id,
      content: result.answer,
      role: "ai",
    });

    return res.json({
      message: aiMessage,
    });
  } catch (error) {
    console.error("Ask question error:", error);

    return res.status(500).json({
      message: "Failed to generate answer",
    });
  }
};
