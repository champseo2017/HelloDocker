import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import * as yup from "yup";
import { IProductValid, IGetListProduct } from "@type/validates";
import { convertToNumber } from "@utils/convertToNumberAddPro";
import { checkProductImages } from "@utils/checkProductImages";
import { handleFilesInRequest } from "@utils/handleFilesInRequest";
import { displayErrorStatus } from "@utils/displayErrorStatus";

/**
 * Define product validation schema using Yup
 * Validates the request body fields for a product
 */
export const productAddSchema = yup.object().shape({
  body: yup
    .object<IProductValid>({
      name: yup.string().required("Product name is required"),
      price: yup.number().required("Product price is required").positive(),
      description: yup
        .string()
        .max(250, "Description should not exceed 250 characters"),
      quantity: yup.number().min(0).integer().required(),
    })
    .defined(),
});

/**
 * Middleware function to validate a product
 * Uses the provided schema to validate the request body.
 * If the validation fails, it returns an error response with status 400.
 * If the validation passes, it calls the next middleware in the chain.
 */

export const validateAddProduct =
  (schema: yup.ObjectSchema<{ body: IProductValid }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      checkProductImages(req.body.productImages);
      await schema.validate({ body: req.body });
      return next();
    } catch (error) {
      handleFilesInRequest(req);
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define product validation schema using Yup
 * Validates the request body fields for a update product
 */
export const productUpdateSchema = yup.object().shape({
  body: yup
    .object<IProductValid>({
      id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
      name: yup.string().required("Product name is required"),
      price: yup.number().required("Product price is required").positive(),
      description: yup
        .string()
        .max(250, "Description should not exceed 250 characters"),
      quantity: yup.number().min(0).integer().required(),
      positionImage: yup
        .array()
        .of(
          yup.object({
            position: yup.number().min(0).integer().required(),
          })
        )
        .min(1),
    })
    .defined(),
});

export const validateUpdateProduct =
  (schema: yup.ObjectSchema<{ body: IProductValid }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({ body: req.body });
      return next();
    } catch (error) {
      handleFilesInRequest(req);
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define get list product validation schema using Yup
 * Validates the request body fields for a get list product
 */
export const getListProductSchema = yup.object().shape({
  page: yup.number().integer().min(0).required().label("Page"),
  sort: yup
    .string()
    .matches(/^(-createdAt)*$/)
    .required()
    .label("Sort"),
  limit: yup.number().integer().min(10).max(100).required().label("Limit"),
});

export const validateGetListProduct =
  (schema: yup.ObjectSchema<IGetListProduct>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query);
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define delete product validation schema using Yup
 * Validates the request body fields for a delete product
 */
export const deleteProductSchema = yup.object<{ id: string }>().shape({
  id: yup
    .string()
    .required()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
    .label("Product ID"),
});

export const validateDeleteProduct =
  (schema: yup.ObjectSchema<{ id: string }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params);
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };

/**
 * Define find product by ID validation schema using Yup
 * Validates the request body fields for finding a product
 */
export const findProductSchema = yup.object<{ id: string }>().shape({
  id: yup
    .string()
    .required()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
    .label("Product ID"),
});

export const validateFindProduct =
  (schema: yup.ObjectSchema<{ id: string }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params);
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };
