import axios from "axios";
import { create } from "zustand";
import type { Conversation } from "../types/conversation";
import { api } from "../config/api";

interface ConversationStore {
  conversations: Conversation[];
  isConversationLoading: Boolean;
  conversationError: null | string;
  createConversation: (
    title: string,
    conversationId?: string,
  ) => Promise<Conversation>;
  getConversation: () => Promise<void>;
  setErrorNull: () => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  isConversationLoading: true,
  conversationError: null,

  createConversation: async (title: string, conversationId?: string) => {
    set({ conversationError: null });
    try {
      const response = await api.post("/conversations", {
        title,
        conversationId,
      });

      const conversation = response.data.conversation;

      set((state) => {
        // Updating an existing conversation
        if (conversationId) {
          return {
            conversations: state.conversations.map((item) =>
              item._id === conversation._id ? conversation : item,
            ),
          };
        }

        // Creating a new conversation
        return {
          conversations: [conversation, ...state.conversations],
        };
      });

      return conversation;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          conversationError:
            error.response?.data?.message || "Failed to create conversation.",
        });
      } else {
        set({
          conversationError: "Failed to create conversation.",
        });
      }
      throw error;
    } finally {
      set({ isConversationLoading: false });
    }
  },
  getConversation: async () => {
    set({ conversationError: null });

    try {
      const response = await api.get("/conversations");
      set({
        conversations: response.data.conversations,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          conversationError:
            error.response?.data?.message || "Failed to create conversation.",
        });
      } else {
        set({
          conversationError: "Failed to create conversation.",
        });
      }
      throw error;
    } finally {
      set({ isConversationLoading: false });
    }
  },

  setErrorNull: () => set({ conversationError: null }),
}));
