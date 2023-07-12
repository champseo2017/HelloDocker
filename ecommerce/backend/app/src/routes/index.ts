import express from "express";
import { userRoutes } from "./user";
import { productRoutes } from "./product";
import { cartRoutes } from "./cart";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);

export default router;
