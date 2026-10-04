import { env } from "../config/env.js";

interface JinaEmbeddingResponse {
  model: string;
  data: Array<{
    object: string;
    index: number;
    embedding: number[];
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
  };
}

export const embedDocuments = async (chunks: string[]) => {
  const apiKey = env.JINA_API_KEY;
  if (!apiKey) {
    throw new Error("JINA_API_KEY environment variable is missing.");
  }

  if (chunks.length === 0) {
    return [];
  }

  const response = await fetch(env.JINA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "jina-embeddings-v3",
      input: chunks,
      task: "retrieval.passage",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jina Embeddings API failed [${response.status}]: ${errorText}`,
    );
  }

  const result = (await response.json()) as JinaEmbeddingResponse;

  const sortedData = result.data.sort((a, b) => a.index - b.index);
  return sortedData.map((item) => item.embedding);
};

export const embedQuery = async (query: string) => {
  const [vector] = await embedDocuments([query]);
  return vector;
};
