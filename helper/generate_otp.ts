const speakeasy = require("speakeasy");

const secret = speakeasy.generateSecret({ length: 20 });

export const generateOtp = () => {
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });

  return otp;
};
