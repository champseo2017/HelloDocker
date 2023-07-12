import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { displayStatus } from "@utils/displayStatus";
import { getAuthToken } from "@utils/getAuthToken";
import { ITokenPayload, IRequestUser } from "@type/middlewares";

export const verifyToken = (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return displayStatus(res, 401, "Authorization token must be provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as ITokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    displayStatus(res, 401, "Token is not valid or expired");
  }
};
