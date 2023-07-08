import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequestUser, ITokenPayload } from "@type/middlewares";
import { displayStatus } from "@utils/displayStatus";
import { getAuthToken } from "@utils/getAuthToken";

export const checkRole = (role: string) => {
  return (req: IRequestUser, res: Response, next: NextFunction) => {
    try {
      const token = getAuthToken(req);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as ITokenPayload;

      if (decoded.role !== role) {
        return displayStatus(res, 403, "Unauthorized");
      }

      req.user = decoded;
      next();
    } catch (error) {
      displayStatus(res, 401, "Token is not valid or expired");
    }
  };
};
