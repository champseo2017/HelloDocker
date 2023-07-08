import { Request } from "express";

export const getAuthToken = (req: Request): string | null => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }
  const token = authorizationHeader.split(" ")[1]; // Bearer <token>
  return token || null;
};
