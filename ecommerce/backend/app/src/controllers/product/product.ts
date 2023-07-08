import { Request, Response, NextFunction } from "express";
import { Product } from "@models/product";
import { displayStatus } from "@utils/displayStatus";
import { removeUnwantedFields } from "@utils/removeUnwantedFields";
import { handleFilesInRequest } from "@utils/handleFilesInRequest";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productData = req.body;
  try {
    const imagePaths = (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File) => {
        const publicUrl = `${process.env.PUBLIC_URL_IMAGE_PRO}/${file.filename}`; // Replace with your public URL
        return publicUrl;
      }
    );
    const product = new Product({ ...productData, imagePaths });

    await product.save();
    const returnedProduct = removeUnwantedFields(product.toObject(), [
      "_id",
      "__v",
    ]);

    displayStatus(res, 200, "Product successfully created", returnedProduct);
  } catch (error) {
    handleFilesInRequest(req);
    displayStatus(
      res,
      error.status || 500,
      error.message || "An error occurred while creating the product."
    );
  }
};
