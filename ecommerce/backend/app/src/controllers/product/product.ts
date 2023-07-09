import { Request, Response, NextFunction } from "express";
import path from "path";
import { Product } from "@models/product";
import { displayStatus } from "@utils/displayStatus";
import { removeUnwantedFields } from "@utils/removeUnwantedFields";
import { handleFilesInRequest } from "@utils/handleFilesInRequest";
import { unlinkAsync } from "@utils/unlinkAsync";
import { createCustomError } from "@utils/createCustomError";
import { displayErrorStatus } from "@utils/displayErrorStatus";
import { urlToFilePath } from "@utils/urlToFilePath";
import { IImageObject } from "@type/models";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productData = req.body;
  try {
    const imagePaths = (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File, index: number) => {
        const publicUrl = `${process.env.PUBLIC_URL_IMAGE_PRO}/${file.filename}`; // Replace with your public URL
        return { position: index, url: publicUrl };
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

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find the product in the database
    const product = await Product.findById(req.body.id);
    if (!product) {
      createCustomError("Product not found.", 400);
    }

    // If files are provided, update images and positions
    if (req.files && req.files.length) {
      const files = Array.isArray(req.files) ? req.files : [req.files];
      // @ts-ignore
      const imagePaths = files.map((file: Express.Multer.File, index) => {
        const publicUrl = `${process.env.PUBLIC_URL_IMAGE_PRO}/${file.filename}`;
        // Check if positionImage for this index exists
        if (
          req.body.positionImage &&
          req.body.positionImage[index] &&
          req.body.positionImage[index].position
        ) {
          return {
            position: req.body.positionImage[index].position,
            url: publicUrl,
          };
        } else {
          return { position: product.imagePaths.length + 1, url: publicUrl };
        }
      });

      // Validate if the numbers of positionImage objects match the number of files
      if (
        req.body.positionImage &&
        req.body.positionImage.length !== files.length
      ) {
        createCustomError(
          "Number of images and positionImage objects do not match.",
          400
        );
      }

      // Update or add images at the positions provided in positionImage
      if (req.body.positionImage) {
        for (const positionObject of req.body.positionImage) {
          const position = positionObject.position;

          // Check if position is valid
          if (position < 1 || position > product.imagePaths.length + 1) {
            createCustomError("Invalid image position.", 400);
          }

          // If image path exists at the position, update it
          // @ts-ignore
          const shiftedImagePath: IImageObject | undefined = imagePaths.shift();
          if (shiftedImagePath) {
            if (
              position - 1 < product.imagePaths.length &&
              product.imagePaths[position - 1]
            ) {
              product.imagePaths[position - 1] = shiftedImagePath;
            } else {
              // If no image path at the position, add the image
              product.imagePaths.splice(position - 1, 0, shiftedImagePath);
            }
          } else {
            createCustomError(
              "No image provided for the specified position.",
              400
            );
          }
        }
      }
    } else if (req.body.positionImage) {
      // Handle image deletion
      for (const positionObject of req.body.positionImage) {
        const position = positionObject.position;

        // Check if position is valid
        if (position < 1 || position > product.imagePaths.length) {
          createCustomError("Invalid image position.", 400);
        }

        // Prevent deletion if only one image left
        if (product.imagePaths.length === 1) {
          createCustomError(
            "Cannot delete image. Product must have at least one image.",
            400
          );
        }

        // Delete the image file
        const filePath = urlToFilePath(product.imagePaths[position - 1]?.url);
        try {
          await unlinkAsync(filePath);
        } catch (error) {
          throw createCustomError("Failed to delete image file.", 500);
        }

        // Delete the image path at the position
        product.imagePaths.splice(position - 1, 1);
      }
    }

    // Update the product data
    const updatedData = {
      ...req.body,
      imagePaths: product.imagePaths,
    };
    delete updatedData.id;
    delete updatedData.positionImage;

    // Update the product in the database
    await Product.findByIdAndUpdate(req.body.id, updatedData, { new: true });

    displayStatus(res, 200, "Product successfully updated", updatedData);
  } catch (error) {
    console.log("error", error);
    handleFilesInRequest(req);
    displayErrorStatus(res, error);
  }
};