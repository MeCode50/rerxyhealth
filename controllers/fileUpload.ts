import { Request, Response } from "express";
import { StatusCode } from "../enums/status";
import { imageUpload, pdfUpload } from "../middleware/multer";

// Handle image upload
export const handleImageUpload = (req: Request, res: Response) => {
  try {
    imageUpload.single("image")(req, res, function (err) {
      if (err) {
        console.error("Error uploading image:", err);
        return res
          .status(StatusCode.InternalServerError)
          .json({ message: "Error uploading image", error: err });
      }

      console.log("Uploaded image:", req.file);

      if (!req.file) {
        console.error("No file uploaded");
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "No file uploaded" });
      }

      const imageUrl = req.file.path;
      res
        .status(StatusCode.Created)
        .json({ message: "Image uploaded successfully", imageUrl });
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Internal server error" });
  }
};

// Handle PDF upload
export const handlePdfUpload = (req: Request, res: Response) => {
  try {
    pdfUpload.single("pdf")(req, res, function () {
      if (!req.file) {
        console.error("No file uploaded");
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "No file uploaded" });
      }

      console.log("Uploaded PDF:", req.file);
      const pdfUrl = req.file.path;
      res
        .status(StatusCode.Created)
        .json({ message: "PDF uploaded successfully", pdfUrl });
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Internal server error" });
  }
};
