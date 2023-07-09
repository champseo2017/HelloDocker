import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import { errorCode } from "@type/middlewares";

export const displayErrorStatus = (res: Response, error: errorCode) => {
  if (!error.code) {
    error.code = 500;
    error.message = "Internal Server Error";
  }
  displayStatus(res, error.code, error.message);
};
