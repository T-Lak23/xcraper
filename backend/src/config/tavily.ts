import { tavily } from "@tavily/core";
import { env } from "./env.js";

export const tavilyClient = tavily({
  apiKey: env.TAVILY_API_KEY!,
});
