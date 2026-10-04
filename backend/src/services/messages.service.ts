import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { Message } from "../models/messages.model.js";

export const getConversationMessages = async (conversationId: string) => {
  const messages = await Message.find({
    conversationId,
  }).sort({
    createdAt: 1,
  });

  return messages.map((message) => {
    if (message.role === "human") {
      return new HumanMessage(message.content);
    }

    if (message.role === "ai") {
      return new AIMessage(message.content);
    }

    return new SystemMessage(message.content);
  });
};
