import { Schema, model } from "mongoose";
import { IUser } from "types/models";

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

export default model<IUser>("User", UserSchema);
