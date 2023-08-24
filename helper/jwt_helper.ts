import { CRYPTOHASH } from "../constant";

const jwt = require("jsonwebtoken");

interface IProps {
  data: any;
}

export const signJWT = ({ data }: IProps) => {
  const sign = jwt.sign(data, CRYPTOHASH);
  return sign;
};
