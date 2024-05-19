"use strict";
// import { NextFunction, Request, Response } from "express";
// import { CRYPTOHASH } from "../constant";
// import { StatusCode } from "../enums/status";
// const jwt = require("jsonwebtoken");
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const constant_1 = require("../constant");
const status_1 = require("../enums/status");
const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
    try {
        const authorize = req.headers.authorization;
        const token = authorize === null || authorize === void 0 ? void 0 : authorize.split(" ")[1];
        const decodedToken = jwt.verify(token, constant_1.CRYPTOHASH);
        //@ts-ignore
        req.id = decodedToken.id;
        return next();
    }
    catch (err) {
        return res.status(status_1.StatusCode.Unauthorized).json({
            message: "Unauthorized, Token not present",
        });
    }
};
exports.isAuthenticated = isAuthenticated;
/*declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}


import { NextFunction, Request, Response } from "express";
import { CRYPTOHASH } from "../constant";
import { StatusCode } from "../enums/status";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract JWT token from request header
    const authorize = req.headers.authorization;
    if (!authorize || !authorize.startsWith("Bearer ")) {
      throw new Error("Unauthorized, Token not provided");
    }
    const token = authorize.split(" ")[1];

    // Verify token authenticity
    const decodedToken = jwt.verify(token, CRYPTOHASH) as { id: string };
    const { id } = decodedToken;

    req.id = id;

    return next();
  } catch (err) {
    return res.status(StatusCode.Unauthorized).json({
      message:"Unauthorized, Token not valid",
    });
  }
};*/
