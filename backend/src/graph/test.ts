import { chatGraph } from "./graph.js";

const result = await chatGraph.invoke({
  question: "What is RAG?",
  answer: "",
});

console.log(result);
