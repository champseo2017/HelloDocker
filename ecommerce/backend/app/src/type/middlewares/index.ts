import { Request } from "express";

interface ITokenPayload {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

interface IRequestUser extends Request {
  user?: ITokenPayload;
}

interface errorCodeFileFilter extends Error {
  code?: string;
}

export type { IRequestUser, ITokenPayload, errorCodeFileFilter };
