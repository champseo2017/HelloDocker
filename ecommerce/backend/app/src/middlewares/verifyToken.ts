import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { displayStatus } from "@utils/displayStatus";
import { getAuthToken } from "@utils/getAuthToken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return displayStatus(res, 401, "Authorization token must be provided");
    }

    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    displayStatus(res, 401, "Token is not valid or expired");
  }
};