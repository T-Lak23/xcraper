import mongoose from "mongoose";

const messageAttachmentSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
  },
  { timestamps: true },
);

export const MessageAttachment = mongoose.model(
  "MessageAttachment",
  messageAttachmentSchema,
);
