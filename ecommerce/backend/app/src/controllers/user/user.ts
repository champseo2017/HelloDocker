import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import bcrypt from "bcrypt";
import { User } from "@models/user";
import { IRegisterRequest } from "@type/controller";

export const registerUser = async (req: IRegisterRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    console.log("username", username)
    console.log("password", password)

    // Check if user with the same username already exists
    // const existingUser = await User.findOne({ username });
    // if (existingUser) {
    //   displayStatus(res, 409, "Username already exists");
    //   return;
    // }

    // Generate a salt and hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    // const newUser = new User({
    //   username,
    //   password: hashedPassword,
    // });

    // Save the user to the database
    // const savedUser = await newUser.save();

    // displayStatus(res, 200, "Registration succeed");
  } catch (error) {
    displayStatus(res, 500, "Registration failed");
  }
};
