import express from "express";
import {
  registerUser,
  validateUserReg,
  userRegSchema,
  userLoginSchema,
  validateUserLogin,
  loginUser
} from "@controllers/user";

const userRoutes = express.Router();
userRoutes.post("/reg", validateUserReg(userRegSchema), registerUser);
userRoutes.post("/login", validateUserLogin(userLoginSchema), loginUser);

export { userRoutes };
