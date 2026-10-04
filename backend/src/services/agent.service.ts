import { createAgent } from "langchain";
import { groq } from "../config/groq.js";
import { webSearch } from "./tool.service.js";

export const webAgent = createAgent({
  model: groq,
  tools: [webSearch],
});
