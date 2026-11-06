// export const scrapeFromUrl = async (url: string): Promise<string> => {
//   const response = await fetch(`https://r.jina.ai/${url}`);

//   if (!response.ok) {
//     throw new Error(`Failed to scrape URL: ${url}`);
//   }

//   const text = await response.text();

//   return text;
// };
import {env} from "../config/env.js"

export const scrapeFromUrl = async (url: string): Promise<string> => {
  try {
    const apiKey = env.JINA_API_KEY;

    if (!apiKey) {
      throw new Error("JINA_API_KEY is missing");
    }

    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "text/plain",
      },
      signal: AbortSignal.timeout(60000),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `Jina Reader failed (${response.status}): ${text.slice(0, 500)}`
      );
    }

    if (!text.trim()) {
      throw new Error("Jina returned empty content");
    }

    return text;
  } catch (error) {
    console.error("URL scraping failed:", error);
    throw error;
  }
};


export const extractUrls = (text: string): string[] => {
  const urlRegex = /https?:\/\/[^\s]+/g;

  return text.match(urlRegex) ?? [];
};

export const removeUrls = (query: string): string => {
  return query
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
