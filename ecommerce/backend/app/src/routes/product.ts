import { Router } from "express";
import { checkRole } from "@middlewares/checkRole";
import { verifyToken } from "@middlewares/verifyToken";
import { validateAddProduct, productAddSchema } from "@controllers/product";
import { upload, errorHandlerUpload } from "@middlewares/uploadProImage";

const productRoutes = Router();
productRoutes.post(
  "/add",
  verifyToken,
  checkRole("admin"),
  upload,
  errorHandlerUpload,
  validateAddProduct(productAddSchema),
);

export { productRoutes };
