import { ChatGroq } from "@langchain/groq";
import { env } from "./env.js";
export const groq = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});
