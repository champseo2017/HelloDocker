import { Document } from "mongoose";

interface IRegisterRequest {
  body: {
    username: string;
    password: string;
    role?: "user" | "admin";
  };
}

interface ILoginRequest {
  body: {
    username?: string;
    password?: string;
  };
}

interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: string[];
}

interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

export type { IRegisterRequest, ILoginRequest, IProduct, IUser };
