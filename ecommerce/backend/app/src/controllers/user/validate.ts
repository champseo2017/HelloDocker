import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import * as yup from "yup";
import { IUserReg } from "@type/validates";

/**
 * User registration schema using Yup.
 * Validates the request body fields for username, password, and role.
 */
export const userRegSchema = yup.object().shape({
  body: yup.object<IUserReg>({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    role: yup.string().oneOf(["user", "admin"]).default("user"),
  }).defined(),
});

/**
 * Middleware function to validate user registration.
 * Uses the provided schema to validate the request body, query, and params.
 * If the validation fails, it returns an error response.
 * If the validation passes, it calls the next middleware in the chain.
 */
export const validateUserReg =
  (schema: yup.ObjectSchema<{ body: IUserReg }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      await schema.validate({ body });
      return next();
    } catch (error) {
      displayStatus(res, 401, error?.message);
    }
  };
