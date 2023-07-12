import path from "path";

export const urlToFilePath = (url: string): string => {
  const filename = url.substring(url.lastIndexOf("/") + 1);
  return path.join(__dirname, "../uploads", filename);
};
