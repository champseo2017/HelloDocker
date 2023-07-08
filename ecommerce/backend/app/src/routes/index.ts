import express from "express";
import { userRoutes } from "./user";
import { productRoutes } from "./product";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/product", productRoutes);

export default router;
