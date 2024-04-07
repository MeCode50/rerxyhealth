import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../enums/status"; // Import StatusCode enum
import { CRYPTOHASH } from "../constant";

interface AdminPayload {email: string;role: string}

// Extend the Request object to include the admin property
declare global {namespace Express {interface Request {admin?: AdminPayload}}}

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

export { verifyAdminToken, checkAdminAuthorization };
