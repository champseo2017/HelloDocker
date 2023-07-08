import path from "path";
import fs from "fs";

export const deleteUploadedFiles = (files: Express.Multer.File[]) => {
  const uploadDir = path.join(__dirname, "../controllers/product", "uploads");
  for (const file of files) {
    const filePath = path.join(uploadDir, file.filename);
    fs.unlinkSync(filePath);
  }
};
