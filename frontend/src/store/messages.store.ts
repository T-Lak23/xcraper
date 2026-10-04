import { create } from "zustand";
import type { Message, Document, MessageAttachment } from "../types/messages";
import { api } from "../config/api";
import axios from "axios";

interface CreateMessageResponse {
  message: Message;
  attachment: MessageAttachment | null;
  document: Document | null;
}

interface MessagesStore {
  messages: Message[];
  documents: Document[];
  isMessageLoading: boolean;
  messageError: string | null;
  addMessage: (message: Message) => void;

  createMessage: (
    content: string,
    role: string,
    conversationId: string,
    file?: File,
  ) => Promise<CreateMessageResponse>;

  getMessages: (conversationId: string) => Promise<void>;
  getDocuments: (conversationId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  messages: [],
  documents: [],
  isMessageLoading: false,
  messageError: null,

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // createMessage: async (content, role, conversationId, file) => {
  //   set({
  //     messageError: null,
  //     isMessageLoading: true,
  //   });

  //   try {
  //     const formData = new FormData();

  //     formData.append("content", content);
  //     formData.append("role", role);

  //     if (file) {
  //       formData.append("file", file);
  //     }
  //     const response = await api.post(
  //       `/messages/${conversationId}/messages`,
  //       formData,
  //     );

  //     const { message, document } = response.data;

  //     set({
  //       messages: [...get().messages, message],

  //       ...(document && {
  //         documents: [...get().documents, document],
  //       }),
  //     });
  //     return response.data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       set({
  //         messageError:
  //           error.response?.data?.message || "Failed to create message.",
  //       });
  //     } else {
  //       set({
  //         messageError: "Failed to create message.",
  //       });
  //     }

  //     throw error;
  //   } finally {
  //     set({
  //       isMessageLoading: false,
  //     });
  //   }
  // },

  createMessage: async (content, role, conversationId, file) => {
    set({
      messageError: null,
      isMessageLoading: true,
    });

    try {
      const formData = new FormData();

      formData.append("content", content);
      formData.append("role", role);

      if (file) {
        formData.append("pdf", file);
      }

      const response = await api.post(
        `/messages/${conversationId}/messages`,
        formData,
      );

      const { message, document } = response.data;

      set({
        messages: [
          ...get().messages,
          {
            ...message,
            attachments: response.data.attachment
              ? [
                  {
                    ...response.data.attachment,
                    documentId: document ?? response.data.attachment.documentId,
                  },
                ]
              : [],
          },
        ],
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          messageError:
            error.response?.data?.message || "Failed to create message.",
        });
      } else {
        set({
          messageError: "Failed to create message.",
        });
      }

      throw error;
    } finally {
      set({
        isMessageLoading: false,
      });
    }
  },

  getMessages: async (conversationId) => {
    set({
      messageError: null,
      isMessageLoading: true,
    });

    try {
      const response = await api.get(`/messages/${conversationId}/messages`);

      set({
        messages: response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          messageError:
            error.response?.data?.message || "Failed to fetch messages.",
        });
      } else {
        set({
          messageError: "Failed to fetch messages.",
        });
      }

      throw error;
    } finally {
      set({
        isMessageLoading: false,
      });
    }
  },

  getDocuments: async (conversationId) => {
    set({
      messageError: null,
    });

    try {
      const response = await api.get(
        `/messages/${conversationId}/messages/documents`,
      );

      set({
        documents: response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          messageError:
            error.response?.data?.message || "Failed to fetch documents.",
        });
      } else {
        set({
          messageError: "Failed to fetch documents.",
        });
      }

      throw error;
    }
  },
}));
