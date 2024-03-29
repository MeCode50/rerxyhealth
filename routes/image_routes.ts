// image_router.ts

import express from "express";
import { handleFileUpload } from "../controllers/fileUpload";
import { isAuthenticated } from "../middleware/isAuthenticated";
import upload from "../middleware/multer";

const router = express.Router();

// Handle image upload
router.post("/upload", isAuthenticated, upload.single("image"),handleFileUpload );

export default router;
