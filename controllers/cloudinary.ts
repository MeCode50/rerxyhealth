import { Request, Response } from "express";
import { uploadToCloudinary } from "../helper/Cloudinary/cloudinary";

export const uploadFileToCloudinary = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("File not provided");
    }

    const resourceType = req.file.mimetype.startsWith("image/")
      ? "image"
      : "raw";
    const uploadResult = await uploadToCloudinary(req.file.path, resourceType);

    res.json({ uploadResult });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { uploadFileToCloudinary };