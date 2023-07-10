import { Request, Response, NextFunction } from "express";
import { displayStatus } from "@utils/displayStatus";
import { errorCode } from "@type/middlewares";

export const displayErrorStatus = (res: Response, error: errorCode) => {
  if (!error.code || error.code < 100 || error.code > 599) {
    return displayStatus(res, 500, "Internal Server Error");
  }

  return displayStatus(res, error.code, error.message);
};
