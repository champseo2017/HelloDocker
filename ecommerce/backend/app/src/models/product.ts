import { Document, Schema, model, Model } from "mongoose";
import { IProduct } from "@type/models";
import { createCustomError } from "@utils/createCustomError";

const ImageObjectSchema = new Schema(
  {
    position: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, default: 0 },
    imagePaths: { type: [ImageObjectSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre<IProduct>("save", async function (next) {
  const ProductModel = this.constructor as Model<IProduct>;
  const existingProduct = await ProductModel.findOne({
    name: { $regex: new RegExp(`^${this.name}$`, "i") },
  });

  if (existingProduct) {
    createCustomError("Product with this name already exists.", 400);
    // throw new Error("Product with this name already exists.");
  }
  next();
});

export const Product = model<IProduct>("Product", ProductSchema);
