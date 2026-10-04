// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { spawn } from "node:child_process";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import fs from "node:fs";
// import { env } from "../config/env.js";

// export const createChunks = async (text: string) => {
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 50,
//   });
//   const texts = await splitter.splitText(text);
//   return texts;
// };

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const scriptPath = path.resolve(__dirname, "../../../ai-service/embed.py");

// // const isWindows = process.platform === "win32";
// // const venvPythonPath = path.resolve(
// //   __dirname,
// //   `../../../ai-service/.venv/${isWindows ? "Scripts/python.exe" : "bin/python"}`,
// // );

// // const pythonExecutable = fs.existsSync(venvPythonPath)
// //   ? venvPythonPath
// //   : isWindows
// //     ? "python"
// //     : "python3";

// // export const processChunksInPython = (
// //   chunks: string[],
// // ): Promise<number[][]> => {
// //   return new Promise((resolve, reject) => {
// //     const python = spawn(pythonExecutable, [scriptPath]);

// //     let outputData = "";
// //     let errorData = "";

// //     python.stdout.on("data", (data) => {
// //       outputData += data.toString();
// //     });

// //     python.stderr.on("data", (data) => {
// //       errorData += data.toString();
// //     });

// //     python.on("close", (code) => {
// //       if (code !== 0) {
// //         return reject(
// //           new Error(`Python process exited with error: ${errorData}`),
// //         );
// //       }
// //       try {
// //         const parsed = JSON.parse(outputData);
// //         resolve(parsed.vectors);
// //       } catch (e) {
// //         reject(e);
// //       }
// //     });

// //     python.stdin.write(JSON.stringify({ chunks }));
// //     python.stdin.end();
// //   });
// // };

// interface JinaEmbeddingResponse {
//   model: string;
//   data: Array<{
//     object: string;
//     index: number;
//     embedding: number[];
//   }>;
//   usage: {
//     total_tokens: number;
//     prompt_tokens: number;
//   };
// }

// export const embedChunks = async (chunks: string[]): Promise<number[][]> => {
//   const apiKey = env.JINA_API_KEY;
//   if (!apiKey) {
//     throw new Error("JINA_API_KEY environment variable is missing.");
//   }

//   if (chunks.length === 0) {
//     return [];
//   }

//   const response = await fetch(env.JINA_ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       model: "jina-embeddings-v3",
//       input: chunks,
//       task: "retrieval.passage",
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(
//       `Jina Embeddings API failed [${response.status}]: ${errorText}`,
//     );
//   }

//   const result = (await response.json()) as JinaEmbeddingResponse;

//   const sortedData = result.data.sort((a, b) => a.index - b.index);
//   return sortedData.map((item) => item.embedding);
// };
