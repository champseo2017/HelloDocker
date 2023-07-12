import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import * as yup from "yup";

/**
 * Define add to cart validation schema using Yup
 * Validates the request body fields for adding a product to cart
 */
export const addToCartSchema = yup
  .object<{ productId: string; quantity: number }>()
  .shape({
    productId: yup
      .string()
      .required()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
      .label("Product ID"),
    quantity: yup.number().required().integer().label("Quantity"),
  });

export const validateAddToCart =
  (schema: yup.ObjectSchema<{ productId: string; quantity: number }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define add to cart validation schema using Yup
 * Validates the request body fields for adding a product to cart
 */
export const updateCartSchema = yup
  .object<{ productId: string; quantity: number }>()
  .shape({
    productId: yup
      .string()
      .required()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
      .label("Product ID"),
    quantity: yup.number().required().integer().label("Quantity"),
  });

export const validateUpdateCart =
  (schema: yup.ObjectSchema<{ productId: string; quantity: number }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define delete from cart validation schema using Yup
 * Validates the request body fields for removing a product from cart
 */
export const deleteCartSchema = yup.object<{ productId: string }>().shape({
  productId: yup
    .string()
    .required()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
    .label("Product ID"),
});

export const validateDeleteCart =
  (schema: yup.ObjectSchema<{ productId: string }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params);
      return next();
    } catch (error) {
      console.log("error", error)
      displayStatus(res, 400, error?.message);
    }
  };
