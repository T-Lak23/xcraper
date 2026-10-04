import { useState } from "react";
import { api } from "../config/api";

interface AskQuestionPayload {
  query: string;
  conversationId: string;
}

export const useChat = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const askQuestion = async ({ query, conversationId }: AskQuestionPayload) => {
    setIsGenerating(true);
    setChatError(null);

    try {
      const response = await api.post("/chat", {
        query,
        conversationId,
      });

      return response.data;
    } catch (error) {
      console.error("Chat error:", error);

      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setChatError(message);

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    askQuestion,
    isGenerating,
    chatError,
  };
};
