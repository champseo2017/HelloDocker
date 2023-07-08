import { deleteUploadedFiles } from "@utils/deleteUploadedFiles";
import { Request } from "express";
export const handleFilesInRequest = (req: Request) => {
  if (req.files && Object.keys(req.files).length > 0) {
    const files = Object.values(req.files);
    deleteUploadedFiles(files);
  }
};
