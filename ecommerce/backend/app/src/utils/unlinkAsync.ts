import fs from "fs";
export const unlinkAsync = (filePath: string) =>
  new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });