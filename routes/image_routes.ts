
import express from "express";
import { handleFileUpload } from "../controllers/fileUpload";
import { isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../middleware/multer";

const router = express.Router();

// Handle image upload
router.post("/upload", isAuthenticated, upload.single("image"), handleFileUpload);

// pdf upload 
router.post("/upload", isAuthenticated, upload.single("pdf"), handleFileUpload);

export default router;
