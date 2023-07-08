import { Document, Schema, model, Model } from "mongoose";
import { IProduct } from "@type/models";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, default: 0 },
    imagePaths: { type: [String] },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre<IProduct>("save", async function (next) {
  const ProductModel = this.constructor as Model<IProduct>;
  const existingProduct = await ProductModel.findOne({ name: this.name });
  if (existingProduct) {
    throw new Error("Product with this name already exists.");
  }
  next();
});

export const Product = model<IProduct>("Product", ProductSchema);
