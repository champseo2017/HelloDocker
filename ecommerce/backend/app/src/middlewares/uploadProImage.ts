import { displayStatus } from "@utils/displayStatus";
import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import { errorCode, errorCodeFileFilter } from "@type/middlewares";
import { createCustomError } from "@utils/createCustomError";
import { displayErrorStatus } from "@utils/displayErrorStatus";

// Configure multer storage
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory to save the uploaded files
    const dir = path.join(__dirname, "../controllers/product", "uploads");

    // Check if directory exists, if not then create the directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Call the callback function with the directory
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Define the name of the file
    const filename = Date.now() + file.originalname;

    // Call the callback function with the filename
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    // You can define your error here:
    const error: errorCodeFileFilter = new Error(
      "Only image files are allowed!"
    );
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }
  cb(null, true);
};

export const upload = (maxFiles = 4) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: maxFiles,
    },
  }).array("productImages", maxFiles);
};

// Middleware errorHandlerUpload
export const errorHandlerUpload = (maxFiles = 4) => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
      if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          createCustomError("File size exceeds the limit.", 400);
        } else if (
          err.code === "LIMIT_UNEXPECTED_FILE" ||
          err.code === "LIMIT_FILE_COUNT"
        ) {
          createCustomError(`Too many files uploaded. Maximum is ${maxFiles}.`, 400);
        }
      } else if (err.code === "INVALID_FILE_TYPE") {
        createCustomError(err.message, 400);
      } else {
        // Call next() if no error occurred
        next();
      }
    } catch (error) {
      displayErrorStatus(res, error);
    }
  };
};
