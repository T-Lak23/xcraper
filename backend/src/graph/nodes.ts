import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { groq } from "../config/groq.js";
import { generateAnswer } from "../services/chat.service.js";
import { embedDocuments, embedQuery } from "../services/embedding.service.js";
import {
  findUrlDocument,
  retrieveContext,
} from "../services/retrieval.service.js";
import { webSearch } from "../services/tool.service.js";
import { ChatState } from "./state.js";
import { scrapeFromUrl } from "../services/urlScrape.service.js";
import { createChunks } from "../rag/chunking.js";
import { storeVectors } from "../services/vectorstore.service.js";
import { Document } from "../models/documents.model.js";
import type { RunnableConfig } from "@langchain/core/runnables";

export const routerNode = async (state: typeof ChatState.State) => {
  const question = state.question.toLowerCase();
  const needsRag = state.documentIds.length > 0;

  const response = await groq.invoke([
    new AIMessage(
      `You are an decider ai agent that responds either true or
       false (Boolean) based on the user query to see if the intent
        of the user is to get the latest informtion or upto date 
        information as of present date.`,
    ),

    new HumanMessage(`Query: ${state.question}`),
  ]);

  const llmNeedsWeb = String(response.content).trim().toLowerCase() === "true";

  const webKeywords = [
    "latest",
    "recent",
    "today",
    "current",
    "now",
    "news",
    "2026",
    "this week",
    "this month",
  ];

  const keywordNeedsWeb = webKeywords.some((keyword) =>
    question.includes(keyword),
  );

  const needsWeb = llmNeedsWeb || keywordNeedsWeb;

  return {
    needsRag,
    needsWeb,
  };
};

export const urlNode = async (state: typeof ChatState.State) => {
  console.log("RUNNNING___________");
  const urls = state.urls;
  const documentIds: Record<string, string> = {};

  for (let url of urls) {
    const exisitingDocumentId = await findUrlDocument(
      url,
      state.conversationId,
    );
    if (exisitingDocumentId) {
      documentIds[url] = exisitingDocumentId;
      continue;
    }
    // let documentId: string = crypto.randomUUID();

    const texts = await scrapeFromUrl(url);
    const chunks = await createChunks(texts);
    const vectors = await embedDocuments(chunks);
    const document = await Document.create({
      conversationId: state.conversationId,
      name: url,
      source: url,
      sourceType: "url",
    });

    const documentId = document._id.toString();
    await storeVectors({
      vectors,
      chunks,
      documentId,
      source: url,
      sourceType: "url",
    });
    documentIds[url] = documentId;
  }

  return {
    documentIds: Object.values(documentIds),
  };
};

export const retrieveNode = async (state: typeof ChatState.State) => {
  const queryVector = await embedQuery(state.question);

  const context = await retrieveContext(
    queryVector as number[],
    state.documentIds,
  );

  return {
    context,
  };
};

export const webSearchNode = async (state: typeof ChatState.State) => {
  const webContext = await webSearch.invoke({
    query: state.question,
  });

  return {
    webContext,
  };
};

// export const generateNode = async (
//   state: typeof ChatState.State,
//   config?: RunnableConfig,
// ) => {
//   const contextParts: string[] = [];

//   if (state.context) {
//     contextParts.push(`DOCUMENT CONTEXT:\n${state.context}`);
//   }

//   if (state.webContext) {
//     contextParts.push(`WEB CONTEXT:\n${state.webContext}`);
//   }

//   const context = contextParts.join("\n\n");

//   const response = await generateAnswer(
//     state.question,
//     context,
//     state.messages,
//     config,
//   );

//   return {
//     answer: response,
//     messages: [new HumanMessage(state.question), new AIMessage(response)],
//   };
// };

export const generateNode = async (
  state: typeof ChatState.State,
  config?: RunnableConfig,
) => {
  const contextParts: string[] = [];

  if (state.context) {
    contextParts.push(`DOCUMENT CONTEXT:\n${state.context}`);
  }

  if (state.webContext) {
    contextParts.push(`WEB CONTEXT:\n${state.webContext}`);
  }

  const context = contextParts.join("\n\n");

  const response = await generateAnswer(
    state.question,
    context,
    state.messages,
    config,
  );

  return {
    answer: response,
  };
};
