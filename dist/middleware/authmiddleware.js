"use strict";
/*import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../enums/status";
import { CRYPTOHASH } from "../constant";

interface AdminPayload {
  email: string;
  role: string;
}

// Extend the Request object to include the admin and user properties
declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
      user?: { id: string };
    }
  }
}

// Authentication middleware function
const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "No token provided" });
  }

  try {
    // Verify token using the signJWT function's secret key
    const decoded = jwt.verify(token, CRYPTOHASH) as AdminPayload;

    req.admin = decoded;

    next();
  } catch (error) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid token" });
  }
};

// Authorization middleware function
const checkAdminAuthorization = (
  req: Request & { admin?: AdminPayload },
  res: Response,
  next: NextFunction,
) => {
  // Extract admin information from request object
  const admin = req.admin as AdminPayload;

  // Check if admin has required permissions
  if (!admin || admin.role !== "admin") {
    return res
      .status(StatusCode.Forbidden)
      .json({ message: "Admin access forbidden" });
  }

  next();
};


const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No token provided");
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Malformed token");
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, CRYPTOHASH) as { id: string };
    console.log("Decoded token:", decoded);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("Invalid token:", error);
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid token" });
  }
};

export { verifyAdminToken, checkAdminAuthorization , verifyUserToken};*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_1 = require("../enums/status");
const constant_1 = require("../constant");
const verifyUserToken = (req, res, next) => {
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
            .json({ message: "Malformed token" });
    }
    try {
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
