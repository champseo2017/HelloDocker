import { displayStatus } from "@utils/displayStatus";
import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import { errorCodeFileFilter } from "@type/middlewares";

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
    const error: errorCodeFileFilter = new Error("Only image files are allowed!");
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 4 // maximum 4 files
  },
}).array("productImages", 4);

// Middleware errorHandlerUpload
export const errorHandlerUpload = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (err instanceof MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        const error = new Error("File size exceeds the limit.");
        displayStatus(res, 400, error.message);
      } else if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
        const error = new Error("Too many files uploaded. Maximum is 4.");
        displayStatus(res, 400, error.message);
      }
    } else if (err.code === "INVALID_FILE_TYPE") {
      displayStatus(res, 400, "Invalid file type");
    } else {
      // Call next() if no error occurred
      next();
    }
  } catch (error) {
    // Handle any other errors
    displayStatus(res, 500, "Internal Server Error");
  }
};
