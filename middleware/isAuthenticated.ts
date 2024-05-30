import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../enums/status";
import { CRYPTOHASH } from "../constant";

interface TokenPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
      role?: string;
    }
  }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid token format" });
  }

  try {
    // Verify token and extract user ID and role
    const decoded = jwt.verify(token, CRYPTOHASH) as TokenPayload;
    req.user = { id: decoded.id };
    req.role = decoded.role;

    next();
  } catch (error) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid token" });
  }
};

export { authenticateUser };
