import express from "express";
import {
  registerUser,
  validateUserReg,
  userRegSchema,
} from "@controllers/user";

const userRoutes = express.Router();
userRoutes.post("/reg", validateUserReg(userRegSchema), registerUser);

export { userRoutes };
