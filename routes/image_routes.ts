import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { imageUpload, pdfUpload } from "../middleware/multer";
import { uploadFileToCloudinary } from "../controllers/cloudinary";

const router = express.Router();

router.post("/upload/image", imageUpload, uploadFileToCloudinary);
router.post("/upload/pdf", pdfUpload, uploadFileToCloudinary);


export default router;
