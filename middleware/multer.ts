import { Request } from "express";
import multer from "multer";
import fs from "fs";

const uploadDirectory = "./uploads";
const imageDestination = `${uploadDirectory}/images`;
const pdfDestination = `${uploadDirectory}/pdfs`;

fs.mkdirSync(imageDestination, { recursive: true });
fs.mkdirSync(pdfDestination, { recursive: true });

const storage = (destination: string) =>
  multer.diskStorage({
    destination(req: Request,file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
    ) {
      cb(null, destination);
    },
    filename(req: Request,file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) {
      cb(null, file.originalname);
    },
  });

const fileFilter = (req: Request,file: Express.Multer.File,
  cb: multer.FileFilterCallback,) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed") as any, false);
  }
};

const upload = (destination: string) =>multer({storage: storage(destination),
    fileFilter,limits: {fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });

const imageUpload = upload(imageDestination);
const pdfUpload = upload(pdfDestination);

export { imageUpload, pdfUpload };
