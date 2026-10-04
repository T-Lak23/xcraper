import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const createChunks = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  return splitter.splitText(text);
};
