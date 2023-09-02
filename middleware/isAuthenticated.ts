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
import { NextFunction, Request, Response } from "express";
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
};
