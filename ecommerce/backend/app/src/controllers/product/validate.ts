import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import * as yup from "yup";
import { IProduct } from "@type/models";

/**
 * Define product validation schema using Yup
 * Validates the request body fields for a product
 */
export const productSchema = yup.object().shape({
  body: yup
    .object<IProduct>({
      name: yup.string().required("Product name is required"),
      price: yup.number().required("Product price is required").positive(),
      description: yup
        .string()
        .max(250, "Description should not exceed 250 characters"),
      quantity: yup.number().positive(),
      // imageUrls: yup
      //   .array()
      //   .of(yup.string())
      //   .max(4, "Maximum of 4 images allowed"),
    })
    .defined(),
});

/**
 * Middleware function to validate a product
 * Uses the provided schema to validate the request body.
 * If the validation fails, it returns an error response with status 400.
 * If the validation passes, it calls the next middleware in the chain.
 */

export const validateProduct =
  (schema: yup.ObjectSchema<{ body: IProduct }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      await schema.validate({ body });
      return next();
    } catch (error) {
      displayStatus(res, 400, error?.message);
    }
  };
