import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatState } from "./state.js";
import {
  retrieveNode,
  generateNode,
  routerNode,
  webSearchNode,
  urlNode,
} from "./nodes.js";

const routerAfterRouter = (state: typeof ChatState.State) => {
  if (state.urls.length > 0) {
    return "url";
  }

  if (state.needsRag && state.needsWeb) {
    return "both";
  }

  if (state.needsRag) {
    return "rag";
  }

  if (state.needsWeb) {
    return "web";
  }

  return "generate";
};

// const builder = new StateGraph(ChatState)
//   .addNode("router", routerNode)
//   .addNode("retrieve", retrieveNode)
//   .addNode("webSearch", webSearchNode)
//   .addNode("generate", generateNode)
//   .addNode("url", urlNode)
//   .addEdge(START, "router")
//   .addConditionalEdges("router", routerAfterRouter, {
//     rag: "retrieve",
//     web: "webSearch",
//     both: "retrieve",
//     generate: "generate",
//     url: "url",
//   })
//   .addConditionalEdges(
//     "retrieve",
//     (state) => {
//       if (state.needsWeb) {
//         return "web";
//       }

//       if (state.urls.length > 0 && state.documentIds.length !== 0) {
//         return "url";
//       }

//       return "generate";
//     },
//     {
//       web: "webSearch",
//       generate: "generate",
//     },
//   )
//   .addEdge("webSearch", "generate")
//   .addEdge("generate", END);

const builder = new StateGraph(ChatState)
  .addNode("router", routerNode)
  .addNode("retrieve", retrieveNode)
  .addNode("webSearch", webSearchNode)
  .addNode("generate", generateNode)
  .addNode("url", urlNode)

  .addEdge(START, "router")

  .addConditionalEdges("router", routerAfterRouter, {
    rag: "retrieve",
    web: "webSearch",
    both: "retrieve",
    generate: "generate",
    url: "url",
  })

  .addEdge("url", "retrieve")

  .addConditionalEdges(
    "retrieve",
    (state) => {
      if (state.needsWeb) {
        return "web";
      }

      return "generate";
    },
    {
      web: "webSearch",
      generate: "generate",
    },
  )

  .addEdge("webSearch", "generate")
  .addEdge("generate", END);

export const chatGraph = builder.compile();
