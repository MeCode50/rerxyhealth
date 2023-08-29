import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validate_completeProfile } from "../../validations/onboarding";

const completeProfile = async (req: Request, res: Response) => {
  const toValidate = req.body;
  const prisma = new PrismaClient();

  try {
    const validations = validate_completeProfile.validate(toValidate);
    console.log(validations);
  } catch (err) {
    console.log(err);
  }
};

export default completeProfile;
