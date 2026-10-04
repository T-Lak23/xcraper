export type Role = "human" | "ai" | "system";

export type SourceType = "pdf" | "url";

export interface Document {
  _id: string;
  conversationId: string;
  name: string;
  source: string;
  sourceType: SourceType;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  _id: string;
  messageId: string;
  documentId: Document | string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments?: MessageAttachment[];
}
