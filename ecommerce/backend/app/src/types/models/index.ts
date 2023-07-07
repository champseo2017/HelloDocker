import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  cart: [string];
}

export type { IUser };
