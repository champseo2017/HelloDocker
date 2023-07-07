import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@models/user";
import { IRegisterRequest, ILoginRequest } from "@type/controller";
import { removeUnwantedFields } from "@utils/removeUnwantedFields";
import { generateJwtToken } from "@utils/generateJwtToken";

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
      "cart",
    ]);

    displayStatus(res, 200, "Registration succeed", result);
  } catch (error) {
    displayStatus(res, 500, error?.message);
  }
};

export const loginUser = async (
  req: ILoginRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Generate a JWT token
    const userGenerate = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };

    const token = generateJwtToken(userGenerate);

    const result = removeUnwantedFields(user.toObject(), [
      "_id",
      "password",
      "createdAt",
      "updatedAt",
      "__v",
      "cart",
      "role",
      "username",
    ]);

    displayStatus(res, 200, "Login succeed", { ...result, token });
  } catch (error) {
    displayStatus(res, 500, error?.message);
  }
};
