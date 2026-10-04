import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const ChatState = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  answer: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  documentIds: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  needsRag: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),

  needsWeb: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  webContext: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  urls: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  ...MessagesAnnotation.spec,
  conversationId: Annotation<string>(),
});
