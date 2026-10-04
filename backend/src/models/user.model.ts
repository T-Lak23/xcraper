import mongoose, {
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
export type UserType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserType>;
