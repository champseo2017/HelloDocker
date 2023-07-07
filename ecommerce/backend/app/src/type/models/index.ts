import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  cart: [string];
  role: string;
}

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export type { IUser, IProduct };
