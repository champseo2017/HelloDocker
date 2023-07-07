import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import bcrypt from "bcrypt";
import { User } from "@models/user";
import { IRegisterRequest } from "@type/controller";
import { removeUnwantedFields } from "@utils/removeUnwantedFields";

export const registerUser = async (
  req: IRegisterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, role } = req.body;

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Use "user" as default role if not provided
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const result = removeUnwantedFields(savedUser.toObject(), [
      "_id",
      "createdAt",
      "updatedAt",
      "__v",
      "cart"
    ]);

    displayStatus(res, 200, "Registration succeed", result);
  } catch (error) {
    displayStatus(res, 500, error?.message);
  }
};
