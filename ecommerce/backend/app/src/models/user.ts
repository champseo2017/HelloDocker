import { Schema, model, Model } from "mongoose";
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
