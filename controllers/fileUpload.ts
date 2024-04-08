import { Request, Response } from "express";
import { StatusCode } from "../enums/status";
import { uploadToCloudinary } from "../helper/Cloudinary/cloudinary";

// Handle file upload
const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {return res.status(StatusCode.BadRequest).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype.startsWith("image")) {
    const imageUrl = await uploadToCloudinary(req.file);

    if (!imageUrl) {return res.status(StatusCode.InternalServerError).json({ message: "Error uploading image to Cloudinary" });
    }

    return res.status(StatusCode.Created).json({ message: "Image uploaded successfully", imageUrl });
    } else if (req.file.mimetype.startsWith("application/pdf")) {
      // Upload the PDF to Cloudinary
      const pdfUrl = await uploadToCloudinary(req.file);

      if (!pdfUrl) {return res.status(StatusCode.InternalServerError).json({ message: "Error uploading PDF to Cloudinary" });
    }
     return res.status(StatusCode.Created).json({ message: "PDF uploaded successfully", pdfUrl });
    } else {return res.status(StatusCode.BadRequest).json({ message: "Unsupported file format" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
  }
};

export { handleFileUpload };
