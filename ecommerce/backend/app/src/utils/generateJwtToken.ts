import jwt from "jsonwebtoken";
import { IUserTokenPayload } from "@type/utils";

export const generateJwtToken = (user: IUserTokenPayload): string => {
  const token = jwt.sign(user, process.env.JWT_SECRET || "", {
    expiresIn: "1d",
  });
  return token;
};
