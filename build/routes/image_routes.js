"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middleware/multer");
const cloudinary_1 = require("../controllers/cloudinary");
const router = express_1.default.Router();
router.post("/upload/image", multer_1.imageUpload, cloudinary_1.uploadFileToCloudinary);
router.post("/upload/pdf", multer_1.pdfUpload, cloudinary_1.uploadFileToCloudinary);
exports.default = router;
