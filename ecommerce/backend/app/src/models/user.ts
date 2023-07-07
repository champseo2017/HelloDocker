import { Schema, model } from "mongoose";
import { IUser } from "@type/models";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);
