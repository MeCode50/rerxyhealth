import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validate_completeProfile } from "../../validations/onboarding";
import { StatusCode } from "../../enums/status";

const completeProfile = async (req: Request, res: Response) => {
  const toValidate = req.body;
  //@ts-ignore
  const userId = req?.id;
  const prisma = new PrismaClient();

  try {
    const validations = await validate_completeProfile.validate(toValidate);
    const { username, matricNumber } = validations;
    const completeProfile = await prisma.setupProfile.create({
      data: {
        username: username,
        matricNumber: matricNumber,
        usersId: userId,
      },
    });

    if (!completeProfile)
      return res
        .status(StatusCode.Forbidden)
        .json({ message: "Failed to add data" });

    //create wallet for the user if user has completed account setup
    const createWallet = await prisma.wallet.create({
      data: {
        balance: 0,
        usersId: userId,
      },
    });

    if (!createWallet) {
      res.status(StatusCode.Forbidden).json({ message: "Wallet created" });
    }

    return res.status(StatusCode.Created).json({
      message: `Account setup has been completed successfully and wallet has been created for the user`,
      data: completeProfile,
    });
  } catch (err) {
    //@ts-ignore
    const errMsg = err?.message;
    res.status(StatusCode.BadRequest).json({
      message: errMsg,
    });
  } finally {
    prisma.$disconnect();
  }
};

export default completeProfile;
