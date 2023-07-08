import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  cart: [string];
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type { IUser, IProduct };
