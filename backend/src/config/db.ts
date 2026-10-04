import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
