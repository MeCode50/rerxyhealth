import { Request, Response } from "express";
import { StatusCode } from "../enums/status";
import { imageUpload, pdfUpload } from "../middleware/multer";

// Handle image upload
export const handleImageUpload = (req: Request, res: Response) => {
  imageUpload(req, res, (err: any) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Error uploading image", error: err.message });
    }

    if (!req.file) {
      console.error("No file uploaded");
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "No file uploaded" });
    }

    const imageUrl = `/api/uploads/images/${req.file.filename}`;
    res
      .status(StatusCode.Created)
      .json({ message: "Image uploaded successfully", imageUrl });
  });
};

// Handle PDF upload
export const handlePdfUpload = (req: Request, res: Response) => {
  pdfUpload(req, res, (err: any) => {
    if (err) {
      console.error("Error uploading PDF:", err);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Error uploading PDF", error: err.message });
    }

    if (!req.file) {
      console.error("No file uploaded");
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "No file uploaded" });
    }

    const pdfUrl = `/api/uploads/pdfs/${req.file.filename}`;
    res
      .status(StatusCode.Created)
      .json({ message: "PDF uploaded successfully", pdfUrl });
  });
};
