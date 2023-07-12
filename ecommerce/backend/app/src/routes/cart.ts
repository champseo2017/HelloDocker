import { Router } from "express";
import { verifyToken } from "@middlewares/verifyToken";
import {
  addToCartSchema,
  validateAddToCart,
  addToCart,
  updateCartSchema,
  validateUpdateCart,
  updateCart,
  deleteCartSchema,
  validateDeleteCart,
  deleteFromCart,
  getCart,
} from "@controllers/cart";

const cartRoutes = Router();

cartRoutes.put(
  "/create",
  verifyToken,
  validateAddToCart(addToCartSchema),
  addToCart
);

cartRoutes.put(
  "/update",
  verifyToken,
  validateUpdateCart(updateCartSchema),
  updateCart
);

cartRoutes.delete(
  "/delete/:productId",
  verifyToken,
  validateDeleteCart(deleteCartSchema),
  deleteFromCart
);

cartRoutes.get("/", verifyToken, getCart);

export { cartRoutes };
