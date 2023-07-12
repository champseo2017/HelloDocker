import { Schema, model } from "mongoose";
import { ICartProduct } from "@type/models";

const productObjectSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const CartSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    products: { type: [productObjectSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICartProduct>("Cart", CartSchema);
