// export const scrapeFromUrl = async (url: string): Promise<string> => {
//   const response = await fetch(`https://r.jina.ai/${url}`);

//   if (!response.ok) {
//     throw new Error(`Failed to scrape URL: ${url}`);
//   }

//   const text = await response.text();

//   return text;
// };


export const scrapeFromUrl = async (url: string): Promise<string> => {
  try {
    console.log("Starting Jina scrape:", url);

    const jinaUrl = `https://r.jina.ai/${url}`;

    const response = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(60000),
    });

    console.log("Jina response status:", response.status);

    const text = await response.text();

    console.log("Jina response preview:", text.slice(0, 500));

    if (!response.ok) {
      throw new Error(
        `Jina returned ${response.status}: ${text.slice(0, 300)}`
      );
    }

    return text;
  } catch (error) {
    console.error("Jina scraping error:", error);
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
