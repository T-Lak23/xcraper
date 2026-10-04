import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: { type: String, required: true },
    role: { type: String, enum: ["system", "human", "ai"], required: true },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
