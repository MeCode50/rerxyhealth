import { Express } from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Function to handle file upload to Cloudinary
export async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string | null> {
  try {
    // Check if a file is provided
    if (!file) {
      return null;
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "YOUR_CLOUDINARY_FOLDER_NAME",
      allowed_formats: ["jpg", "jpeg", "png"],
    });

    // Return the URL of the uploaded file
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}
module.exports = { uploadToCloudinary };
