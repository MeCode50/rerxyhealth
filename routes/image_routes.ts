import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { imageUpload, pdfUpload } from "../middleware/multer";
import { handleImageUpload, handlePdfUpload } from "../controllers/fileUpload";

const router = express.Router();

router.post("/upload/image",isAuthenticated,imageUpload.single("image"),handleImageUpload);

router.post("/upload/pdf",isAuthenticated,pdfUpload.single("pdf"),handlePdfUpload);

export default router;
