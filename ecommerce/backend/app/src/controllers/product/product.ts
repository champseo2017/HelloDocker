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
    console.log("req.files", req.files);
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
          typeof req.body.positionImage[index].position === "number"
        ) {
          return {
            position: req.body.positionImage[index].position,
            url: publicUrl,
          };
        } else {
          return { position: product.imagePaths.length, url: publicUrl };
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
        console.log("product.imagePaths", product.imagePaths);

        const updatedImagePaths = [...product.imagePaths]; // สร้างสำเนาของรายการรูปภาพ

        const existingPositions = updatedImagePaths.map(
          (imagePath) => imagePath.position
        );

        for (const positionObject of req.body.positionImage) {
          const position = positionObject.position;

          // Update the image path at the position
          // @ts-ignore
          const shiftedImagePath: IImageObject | undefined = imagePaths.shift();
          if (shiftedImagePath) {
            // If position is within the range of existing images, update the image path
            const existingIndex = existingPositions.indexOf(position);
            if (existingIndex !== -1) {
              updatedImagePaths[existingIndex] = shiftedImagePath;
            }
            // If position is outside the range of existing images, add the image path
            else {
              updatedImagePaths.push(shiftedImagePath);
            }
          } else {
            createCustomError(
              "No image provided for the specified position.",
              400
            );
          }
        }

        product.imagePaths = updatedImagePaths; // อัปเดตรายการรูปภาพในโมเดลสินค้า
      }
    } else if (req.body.positionImage) {
      // Handle image deletion
      // Sort positionImage from highest to lowest
      const positionImage = req.body.positionImage.sort(
        (a, b) => b.position - a.position
      );

      for (const positionObject of positionImage) {
        const position = positionObject.position;

        // Check if position is valid
        if (position < 0 || position >= product.imagePaths.length) {
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
        const filePath = urlToFilePath(product.imagePaths[position]?.url);
        try {
          await unlinkAsync(filePath);
        } catch (error) {
          throw createCustomError("Failed to delete image file.", 500);
        }

        // Delete the image path at the position
        product.imagePaths.splice(position, 1);
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
    await Product.findOneAndUpdate({ _id: req.body.id }, updatedData, {
      new: true,
    });

    displayStatus(res, 200, "Product successfully updated", updatedData);
  } catch (error) {
    console.log("error", error);
    handleFilesInRequest(req);
    displayErrorStatus(res, error);
  }
};

export const getListProduct = async (req, res, next) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  try {
    const products = await Product.find()
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments();

    const resultProduct = products.map((product) =>
      removeUnwantedFields(product.toObject(), ["__v"])
    );

    const result = {
      products: resultProduct,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count,
    };

    displayStatus(res, 200, "List Product successfully", result);
  } catch (err) {
    displayErrorStatus(res, err);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    displayStatus(res, 200, "Product deleted successfully");
  } catch (error) {
    displayErrorStatus(res, error);
  }
};

export const findProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id);

    if (!products) {
      createCustomError("Product not found", 404);
    }

    const result = removeUnwantedFields(products.toObject(), ["__v"]);

    displayStatus(res, 200, "Product found successfully", result);
  } catch (error) {
    displayErrorStatus(res, error);
  }
};
