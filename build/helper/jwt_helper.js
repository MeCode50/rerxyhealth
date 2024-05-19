"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJWT = void 0;
const constant_1 = require("../constant");
const jwt = require("jsonwebtoken");
const signJWT = (data) => {
    const sign = jwt.sign(data, constant_1.CRYPTOHASH);
    return sign;
};
exports.signJWT = signJWT;
