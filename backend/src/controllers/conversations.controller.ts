import { Conversation } from "../models/conversations.model.js";
import { type Request, type Response } from "express";
import { groq } from "../config/groq.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Message } from "../models/messages.model.js";

// export const createConversation = async (req: Request, res: Response) => {
//   const parser = new StringOutputParser();
//   const chain = groq.pipe(parser);
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }
//     const { title, conversationId } = req.body;
//     const topic = await chain.invoke([
//       [
//         "system",
//         `Generate a conversation title.
// Return only the title.
// No markdown.
// No quotes.
// Maximum 10 words.`,
//       ],
//       ["human", title],
//     ]);
//     // const newConversation = await Conversation.updateOne(
//     //   { userId },
//     //   {
//     //     userId,
//     //     title: topic || title || "New Conversation",
//     //   },
//     //   { upsert: true },
//     // );

//     let newConversation = null;
//     if (conversationId) {
//       const messages = await Message.find({ conversationId });
//       if (messages.length === 0) {
//         newConversation = await Conversation.findOneAndUpdate(
//           { userId },
//           {
//             title: topic || title,
//             userId,
//           },
//           { upsert: true, new: true },
//         );
//       }
//     } else {
//       newConversation = new Conversation({
//         userId,
//         title: topic || title || "New Conversation",
//       });
//       await newConversation.save();
//     }
//     return res.status(201).json({
//       message: "Conversation created successfully",
//       conversation: newConversation,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Conversation server error",
//     });
//   }
// };

export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, conversationId } = req.body;

    let conversation = null;

    if (conversationId) {
      const messageCount = await Message.countDocuments({ conversationId });

      if (messageCount === 0 && title) {
        const parser = new StringOutputParser();
        const chain = groq.pipe(parser);
        const topic = await chain.invoke([
          [
            "system",
            "Generate a concise conversation title. Return only the title. No markdown. No quotes. Maximum 6 words.",
          ],
          ["human", title],
        ]);

        conversation = await Conversation.findOneAndUpdate(
          { _id: conversationId, userId },
          { title: topic.trim() || title },
          { returnDocument: "after" },
        );
      } else {
        conversation = await Conversation.findOne({
          _id: conversationId,
          userId,
        });
      }
    } else {
      if (title.trim().toLowerCase() !== "new conversation") {
        const parser = new StringOutputParser();
        const chain = groq.pipe(parser);
        const topic = await chain.invoke([
          [
            "system",
            "Generate a concise conversation title. Return only the title. No markdown. No quotes. Maximum 6 words.",
          ],
          ["human", title],
        ]);
        conversation = new Conversation({
          userId,
          title: topic || "New Conversation",
        });
        await conversation.save();
      } else {
        conversation = new Conversation({
          userId,
          title: title || "New Conversation",
        });
        await conversation.save();
      }
    }

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json({
      message: "Conversation processed successfully",
      conversation,
    });
  } catch (error) {
    console.error("Create/Update conversation error:", error);
    return res.status(500).json({ message: "Conversation server error" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const conversations = await Conversation.find({ userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      message: "Conversations retrieved successfully",
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Conversation server error",
    });
  }
};
