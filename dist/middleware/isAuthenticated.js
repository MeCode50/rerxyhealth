"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_1 = require("../enums/status");
const constant_1 = require("../constant");
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "Invalid token format" });
    }
    try {
        // Verify token and extract user ID and role
        const decoded = jsonwebtoken_1.default.verify(token, constant_1.CRYPTOHASH);
        req.user = { id: decoded.id };
        req.role = decoded.role;
        next();
    }
    catch (error) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "Invalid token" });
    }
};
exports.authenticateUser = authenticateUser;
