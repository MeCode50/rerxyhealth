"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = require("../helper/Cloudinary/cloudinary");
const uploadFileToCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new Error("File not provided");
        }
        const resourceType = req.file.mimetype.startsWith("image/")
            ? "image"
            : "raw";
        const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(req.file.path, resourceType);
        res.json({ uploadResult });
    }
    catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.uploadFileToCloudinary = uploadFileToCloudinary;
exports.default = { uploadFileToCloudinary: exports.uploadFileToCloudinary };
