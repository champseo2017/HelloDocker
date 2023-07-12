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
import { IImageObject, ICartProduct, ICart } from "@type/models";
import { User } from "@models/user";
import { IProduct, IUser } from "@type/controller";
import { Cart } from "@models/cart";
import { Document as MongooseDocument } from "mongoose";

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
    } else if (req.body.positionImage && req.body.positionImage.length) {
      // Sort positionImage from highest to lowest
      const positionImage = req.body.positionImage.sort(
        (a, b) => b.position - a.position
      );
      for (const positionObject of positionImage) {
        const position = positionObject.position;

        // Check if position is valid
        const existingImage = product.imagePaths.find(
          (imagePath) => imagePath.position === position
        );
        if (!existingImage) {
          createCustomError("Invalid image position.", 400);
        } else {
          // Prevent deletion if only one image left
          if (product.imagePaths.length === 1) {
            createCustomError(
              "Cannot delete image. Product must have at least one image.",
              400
            );
          }
          // Delete the image file
          const filePath = urlToFilePath(existingImage.url);
          try {
            await unlinkAsync(filePath);
          } catch (error) {
            throw createCustomError("Failed to delete image file.", 500);
          }
          // Delete the image path at the position
          product.imagePaths = product.imagePaths.filter(
            (imagePath) => imagePath.position !== position
          );
        }
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

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { user: userAuth }: any = req;
    const { productId, quantity } = req.body;

    // Find the user's cart or create a new one if not exist
    let cart: ICart | null = await Cart.findOne({
      user: userAuth?.userId,
    }).populate({
      path: "products.product",
      model: "Product",
    });

    if (!cart) {
      let cartDoc = new Cart({ user: userAuth?.userId, products: [] });
      await cartDoc.save();
      cart = cartDoc.toObject() as ICart;
    }

    // Check if product already in the cart
    const productInCart = cart.products.some(
      (cartItem: ICartProduct) => cartItem.product._id.toString() === productId
    );

    if (productInCart) {
      return createCustomError("Product already added to cart", 404);
    }

    // Find the product
    const product: IProduct = await Product.findById(productId);
    if (!product) {
      return createCustomError("Product not found", 404);
    }

    // Check if product is available in stock
    if (product.quantity < quantity) {
      return createCustomError("Not enough product in stock", 404);
    }

    // Reduce the product quantity
    await Product.updateOne(
      { _id: productId },
      { $inc: { quantity: -quantity } }
    );

    // Add the product to the cart
    cart.products.push({ product: productId, quantity: quantity });

    // Update the cart
    await Cart.updateOne(
      { user: userAuth?.userId },
      { $push: { products: { product: productId, quantity: quantity } } }
    );

    displayStatus(res, 200, "Product added to cart successfully");
  } catch (error) {
    displayErrorStatus(res, error);
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { user: userAuth }: any = req;
    const { productId, quantity } = req.body;

    // Find the user's cart or create a new one if not exist
    let cart: ICart | null = await Cart.findOne({
      user: userAuth?.userId,
    }).populate({
      path: "products.product",
      model: "Product",
    });

    // Check if product already in the cart
    const productInCartIndex = cart.products.findIndex(
      (cartItem: ICartProduct) => cartItem.product._id.toString() === productId
    );

    // Find the product
    const product: IProduct = await Product.findById(productId);
    if (!product) {
      return createCustomError("Product not found", 404);
    }

    // Check if product is available in stock
    if (product.quantity < quantity) {
      return createCustomError("Not enough product in stock", 404);
    }

    // Reduce the product quantity
    await Product.updateOne(
      { _id: productId },
      { $inc: { quantity: -quantity } }
    );

    if (productInCartIndex !== -1) {
      // If product is already in the cart, update the quantity
      await Cart.updateOne(
        { user: userAuth?.userId, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      // If product is not in the cart, add it
      await Cart.updateOne(
        { user: userAuth?.userId },
        { $push: { products: { product: productId, quantity: quantity } } }
      );
    }

    displayStatus(res, 200, "Product update to cart successfully");
  } catch (error) {
    displayErrorStatus(res, error);
  }
};

export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const { user: userAuth }: any = req;
    const { productId } = req.params;

    // Find the user's cart
    let cart: ICart | null = await Cart.findOne({
      user: userAuth?.userId,
    }).populate({
      path: "products.product",
      model: "Product",
    });

    // Check if product already in the cart
    const productInCartIndex = cart.products.findIndex(
      (cartItem: ICartProduct) => {
        return cartItem.product._id.toString() === productId
      }
    );

    if (productInCartIndex === -1) {
      // If product is not in the cart, return error
      return createCustomError("Product not found in cart", 404);
    }

    // Find the product
    const product: IProduct = await Product.findById(productId);
    if (!product) {
      return createCustomError("Product not found", 404);
    }

    // Add the quantity back to the product stock
    await Product.updateOne(
      { _id: productId },
      { $inc: { quantity: cart.products[productInCartIndex].quantity } }
    );

    // Remove the product from the cart
    await Cart.updateOne(
      { user: userAuth?.userId },
      { $pull: { products: { product: productId } } }
    );

    displayStatus(res, 200, "Product removed from cart successfully");
  } catch (error) {
    console.log("error", error)
    displayErrorStatus(res, error);
  }
};


export const getCart = async (req: Request, res: Response) => {
  try {
    const { user: userAuth }: any = req;

    // Find the user's cart
    let cart: ICart | null = await Cart.findOne({
      user: userAuth?.userId,
    }).populate({
      path: "products.product",
      model: "Product",
    }).lean();

    if (!cart) {
      return createCustomError("Cart not found", 404);
    }

    // Remove the '__v' field from each product in the cart
    cart.products.forEach(product => {
      product.product = removeUnwantedFields(product.product, ['__v']);
    });

    // Remove the '__v' field from the cart data
    cart = removeUnwantedFields(cart, ['__v', 'user']);

    displayStatus(res, 200, "Cart retrieved successfully", cart);
  } catch (error) {
    displayErrorStatus(res, error);
  }
};
