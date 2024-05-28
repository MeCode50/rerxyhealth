"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = exports.checkAdminAuthorization = exports.verifyAdminToken = void 0;
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
/*export const attachUserId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Extract the user ID from the request headers or JWT token
  const userId = req.headers.authorization as string | undefined;

  if (!userId) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "User ID not provided" });
  }

  // Attach the user ID to the req object
  req.id = userId;

  next();
};*/
const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "No token provided" });
    }
    try {
        // Verify token and extract user ID
        const decoded = jsonwebtoken_1.default.verify(token, constant_1.CRYPTOHASH);
        req.user = { id: decoded.id }; // Set user information on the request object
        next();
    }
    catch (error) {
        return res
            .status(status_1.StatusCode.Unauthorized)
            .json({ message: "Invalid token" });
    }
};
exports.verifyUserToken = verifyUserToken;
