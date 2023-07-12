import { Document, Schema, model, Types } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
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

interface ICartProduct {
  product: Types.ObjectId | IProduct;
  quantity: number;
}

interface ICart extends Document {
  user: Types.ObjectId;
  products: ICartProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type { IUser, IProduct, IImageObject, ICartProduct, ICart };
