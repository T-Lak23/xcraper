import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["pdf", "url"],
      required: true,
    },
  },
  { timestamps: true },
);

export const Document = mongoose.model("Document", documentSchema);
