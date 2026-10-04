import { ChatPromptTemplate } from "@langchain/core/prompts";
import { groq } from "../config/groq.js";
import type { RunnableConfig } from "@langchain/core/runnables";

export const generateAnswer = async (
  query: string,
  context: string,
  messages: any[],
  config?: RunnableConfig,
) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are a helpful AI assistant.

If context is provided, use it to answer the question.

If context is empty, answer the question normally using your own knowledge.

Do not make up information that contradicts the provided context.

If the provided context does not contain enough information to answer the question, say so.
`,
    ],

    ...messages,

    [
      "human",
      `
Context:

{context}

Question:

{question}
`,
    ],
  ]);

  const chain = prompt.pipe(groq);

  const response = await chain.invoke(
    {
      context,
      question: query,
    },
    config,
  );

  return response.content;
};
