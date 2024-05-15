import { Request, Response, NextFunction } from "express";
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


export { verifyAdminToken, checkAdminAuthorization };
