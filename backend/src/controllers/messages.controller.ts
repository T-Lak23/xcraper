import { type Request, type Response } from "express";
import { Message } from "../models/messages.model.js";
import { Document } from "../models/documents.model.js";
import { MessageAttachment } from "../models/messageAttachaments.model.js";
import { Conversation } from "../models/conversations.model.js";

import { extractPdfText } from "../services/pdf.service.js";
import { createChunks } from "../rag/chunking.js";
import { embedDocuments } from "../services/embedding.service.js";
import { storeVectors } from "../services/vectorstore.service.js";

export const indexPdf = async (
  file: Express.Multer.File,
  documentId: string,
) => {
  const pdf = await extractPdfText(file.buffer);

  const chunks = await createChunks(pdf.text);

  const vectors = await embedDocuments(chunks);

  await storeVectors({
    documentId,
    vectors,
    chunks,
    source: file.originalname,
    sourceType: "pdf",
    pageCount: pdf.total,
  });
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content, role } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const conversationId = req.params.conversationId;

    const conversation = await Conversation.findOne({
      userId,
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const newMessage = new Message({
      content,
      role,
      conversationId: conversation._id,
    });

    await newMessage.save();

    const file = req.file;

    let attachment = null;
    let document = null;

    if (file) {
      document = new Document({
        conversationId: conversation._id,
        name: file.originalname,
        source: file.originalname,
        sourceType: "pdf",
      });

      await document.save();

      await indexPdf(file, document._id.toString());

      attachment = new MessageAttachment({
        messageId: newMessage._id,
        documentId: document._id,
      });

      await attachment.save();
    }

    return res.status(201).json({
      message: newMessage,
      attachment,
      document,
    });
  } catch (error) {
    console.error("Error creating message:", error);

    return res.status(500).json({
      message: "Error creating message",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const conversationId = req.params.conversationId;

    // Make sure this conversation belongs to the logged-in user
    const conversation = await Conversation.findOne({
      userId,
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({
      createdAt: 1,
    });

    const messageIds = messages.map((message) => message._id);

    const attachments = await MessageAttachment.find({
      messageId: {
        $in: messageIds,
      },
    }).populate("documentId");

    const messagesWithAttachments = messages.map((message) => {
      const messageAttachments = attachments.filter(
        (attachment) =>
          attachment.messageId.toString() === message._id.toString(),
      );

      return {
        ...message.toObject(),
        attachments: messageAttachments,
      };
    });

    return res.status(200).json(messagesWithAttachments);
  } catch (error) {
    console.error("Error retrieving messages:", error);

    return res.status(500).json({
      message: "Error retrieving messages",
    });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const conversationId = req.params.conversationId;

    // Make sure this conversation belongs to the logged-in user
    const conversation = await Conversation.findOne({
      userId,
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const documents = await Document.find({
      conversationId: conversation._id,
    }).sort({
      createdAt: 1,
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error("Error retrieving documents:", error);

    return res.status(500).json({
      message: "Error retrieving documents",
    });
  }
};
