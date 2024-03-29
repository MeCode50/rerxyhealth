import { Request, Response } from "express";
import { StatusCode } from "../enums/status";
import { uploadToCloudinary } from "../helper/Cloudinary/cloudinary"; 

// Handle file upload
const handleFileUpload = async (req: Request, res: Response) => {
  try {
    // Check if a file is provided in the request
    if (!req.file) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "No file uploaded" });
    }

    // Upload the file to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file);

    if (!imageUrl) {
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Error uploading image to Cloudinary" });
    }

    return res
      .status(StatusCode.Created)
      .json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Internal server error" });
  }
};

export { handleFileUpload };
