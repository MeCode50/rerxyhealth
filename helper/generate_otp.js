"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const speakeasy = require("speakeasy");
const secret = speakeasy.generateSecret({ length: 20 });
const generateOtp = () => {
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
    });
    return otp;
};
exports.generateOtp = generateOtp;
