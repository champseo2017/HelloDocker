import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  cart: [string];
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IImageObject {
  position: number;
  url: string;
}

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: IImageObject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type { IUser, IProduct, IImageObject };
