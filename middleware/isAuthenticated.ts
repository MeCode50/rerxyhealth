// import { NextFunction, Request, Response } from "express";
// import { CRYPTOHASH } from "../constant";
// import { StatusCode } from "../enums/status";
// const jwt = require("jsonwebtoken");

// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const authorize = req.headers.authorization;
//     const token = authorize?.split(" ")[1];
//     jwt.verify(token, CRYPTOHASH) as {
//       id: string;
//     };
//     //@ts-ignore
//     req?.id = token.id;
//    return next();
//   } catch (err) {
//     return res.status(StatusCode.Unauthorized).json({
//       message: "Unauthorized, Token not present",
//     });
//   }
// };

/*import { NextFunction, Request, Response } from "express";
import { CRYPTOHASH } from "../constant";
import { StatusCode } from "../enums/status";
const jwt = require("jsonwebtoken");

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorize = req.headers.authorization;
    const token = authorize?.split(" ")[1];
    const decodedToken = jwt.verify(token, CRYPTOHASH) as { id: string };
    //@ts-ignore
    req.id = decodedToken.id;
    return next();
  } catch (err) {
    return res.status(StatusCode.Unauthorized).json({
      message: "Unauthorized, Token not present",
    });
  }
};*/

declare global {
  namespace Express {
    interface Request {
      id?: string; // Define the id property on the Request object
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

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    // Handle token verification errors
    return res.status(StatusCode.Unauthorized).json({
      message:"Unauthorized, Token not valid",
    });
  }
};

