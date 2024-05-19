"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePdfUpload = exports.handleImageUpload = void 0;
const status_1 = require("../enums/status");
const multer_1 = require("../middleware/multer");
// Handle image upload
const handleImageUpload = (req, res) => {
    multer_1.imageUpload.single("image")(req, res, function (err) {
        if (err) {
            console.error("Error uploading image:", err);
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "Error uploading image", error: err.message });
        }
        if (!req.file) {
            console.error("No file uploaded");
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "No file uploaded" });
        }
        const imageUrl = `/api/uploads/images/${req.file.filename}`;
        res
            .status(status_1.StatusCode.Created)
            .json({ message: "Image uploaded successfully", imageUrl });
    });
};
exports.handleImageUpload = handleImageUpload;
// Handle PDF upload
const handlePdfUpload = (req, res) => {
    multer_1.pdfUpload.single("pdf")(req, res, function (err) {
        if (err) {
            console.error("Error uploading PDF:", err);
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "Error uploading PDF", error: err.message });
        }
        if (!req.file) {
            console.error("No file uploaded");
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "No file uploaded" });
        }
        const pdfUrl = `/api/images/uploads/pdfs/${req.file.filename}`;
        res
            .status(status_1.StatusCode.Created)
            .json({ message: "PDF uploaded successfully", pdfUrl });
    });
};
exports.handlePdfUpload = handlePdfUpload;
