import { Request, Response } from "express";
import { Product } from "@models/product";
import { displayStatus } from "@utils/displayStatus";
import { removeUnwantedFields } from "@utils/removeUnwantedFields";
import { createCustomError } from "@utils/createCustomError";
import { displayErrorStatus } from "@utils/displayErrorStatus";
import { ICartProduct, ICart } from "@type/models";
import { IProduct } from "@type/controller";
import { Cart } from "@models/cart";


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
