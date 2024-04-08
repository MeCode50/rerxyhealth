
import express from "express";
import { handleFileUpload } from "../controllers/fileUpload";
import { isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../middleware/multer";

const router = express.Router();

// Handle image upload
router.post("/upload/image", isAuthenticated, upload.single("image"), handleFileUpload);

// pdf upload 
router.post("/upload/pdf", isAuthenticated, upload.single("pdf"), handleFileUpload);

export default router;
