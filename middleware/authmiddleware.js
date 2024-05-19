"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminAuthorization = exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_1 = require("../enums/status");
const constant_1 = require("../constant");
// Authentication middleware function
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "No token provided" });
    }
    try {
        // Verify token using the signJWT function's secret key
        const decoded = jsonwebtoken_1.default.verify(token, constant_1.CRYPTOHASH);
        req.admin = decoded;
        next();
    }
    catch (error) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "Invalid token" });
    }
};
exports.verifyAdminToken = verifyAdminToken;
// Authorization middleware function
const checkAdminAuthorization = (req, res, next) => {
    // Extract admin information from request object
    const admin = req.admin;
    // Check if admin has required permissions
    if (!admin || admin.role !== "admin") {
        return res
            .status(status_1.StatusCode.Forbidden)
            .json({ message: "Admin access forbidden" });
    }
    next();
};
exports.checkAdminAuthorization = checkAdminAuthorization;
