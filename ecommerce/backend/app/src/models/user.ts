import { Document, Schema, model } from "mongoose";
import { IUser } from "types/models";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
