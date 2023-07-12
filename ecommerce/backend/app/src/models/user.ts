import { Schema, model, Model } from "mongoose";
import { IUser } from "@type/models";
import { Cart } from "./cart";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    // Delete user's cart when user is deleted
    await Cart.deleteOne({ user: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Pre-save middleware to check for duplicate username
UserSchema.pre<IUser>("save", async function (next) {
  const UserModel = this.constructor as Model<IUser>;
  const existingUser = await UserModel.findOne({ username: this.username });
  if (existingUser) {
    throw new Error("Username already exists");
  }
  next();
});

export const User = model<IUser>("User", UserSchema);
