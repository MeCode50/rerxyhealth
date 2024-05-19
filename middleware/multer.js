"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfUpload = exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uploadDirectory = "./uploads";
// Ensure upload directory exists
fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("Only images and PDFs are allowed"), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
exports.imageUpload = upload.single("image");
exports.pdfUpload = upload.single("pdf");
