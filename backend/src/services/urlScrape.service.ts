export const scrapeFromUrl = async (url: string): Promise<string> => {
  const response = await fetch(`https://r.jina.ai/${url}`);

  if (!response.ok) {
    throw new Error(`Failed to scrape URL: ${url}`);
  }

  const text = await response.text();

  return text;
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
