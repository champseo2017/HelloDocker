import { errorCode } from "@type/middlewares";

export const createCustomError = (message: string, code: number) => {
  const error: errorCode = new Error(message);
  error.code = code;
  throw error;
};
