import { z } from "zod";
import "dotenv/config";
const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  JINA_API_KEY: z.string(),
  JINA_ENDPOINT: z.string(),
  QDRANT_API_KEY: z.string(),
  QDRANT_CLUSTER_ENPOINT: z.url(),
  GROQ_API_KEY: z.string(),
  TAVILY_API_KEY: z.string(),
  MONGO_URI: z.url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables");
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
