import { tool } from "@langchain/core/tools";
import { tavilyClient } from "../config/tavily.js";
import { z } from "zod";

export const webSearch = tool(
  async ({ query }) => {
    const response = await tavilyClient.search(query, {
      maxResults: 5,
    });

    return response.results
      .map(
        (result) =>
          `Title: ${result.title}\nURL:${result.url}\nContent: ${result.content}`,
      )
      .join("\n\n");
  },
  {
    name: "web_search",
    description:
      "Search the web for current information that is not available in the provided documents or if the user asks for a latest information on anything.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  },
);
