import { CRYPTOHASH } from "../constant";

const jwt = require("jsonwebtoken");

export const signJWT = (data: {}) => {
  const sign = jwt.sign(data, CRYPTOHASH);
  return sign;
};
