import { Router } from "express";
import { checkRole } from "@middlewares/checkRole";
import { verifyToken } from "@middlewares/verifyToken";
import {
  validateAddProduct,
  productAddSchema,
  addProduct,
  productUpdateSchema,
  validateUpdateProduct,
  updateProduct,
  getListProductSchema,
  validateGetListProduct,
  getListProduct,
  deleteProductSchema,
  validateDeleteProduct,
  deleteProduct,
  findProductSchema,
  validateFindProduct,
  findProductById,
  addToCartSchema,
  validateAddToCart,
  addToCart,
  updateCartSchema,
  validateUpdateCart,
  updateCart
} from "@controllers/product";
import { upload, errorHandlerUpload } from "@middlewares/uploadProImage";
import { convertBodyTypes } from "@utils/convertBodyTypes";

const productRoutes = Router();
productRoutes.post(
  "/add",
  verifyToken,
  checkRole("admin"),
  upload(),
  errorHandlerUpload(),
  convertBodyTypes({
    quantity: "number",
  }),
  validateAddProduct(productAddSchema),
  addProduct
);

productRoutes.put(
  "/update",
  verifyToken,
  checkRole("admin"),
  upload(),
  errorHandlerUpload(),
  convertBodyTypes({
    quantity: "number",
    positionImage: "array"
  }),
  validateUpdateProduct(productUpdateSchema),
  updateProduct
);

productRoutes.get(
  "/",
  validateGetListProduct(getListProductSchema),
  getListProduct,
);

productRoutes.delete(
  "/delete/:id",
  verifyToken,
  checkRole("admin"),
  validateDeleteProduct(deleteProductSchema),
  deleteProduct
);

productRoutes.get(
  "/:id",
  validateFindProduct(findProductSchema),
  findProductById,
);

productRoutes.put(
  "/add/cart",
  verifyToken,
  checkRole("admin"),
  validateAddToCart(addToCartSchema),
  addToCart
);

productRoutes.put(
  "/update/cart",
  verifyToken,
  checkRole("admin"),
  validateUpdateCart(updateCartSchema),
  updateCart,
);

export { productRoutes };
