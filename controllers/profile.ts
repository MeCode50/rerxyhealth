//this function helps to get user profile
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../enums/status";

export const getUserProfile = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  //@ts-ignore
  const id = req?.id;

  try {
    const getProfile = await prisma.users.findUnique({
      where: { id },
      include: {
        TransactionPin: true,
        SetupProfile: true,
        Wallet: true,
      },
    });

    if (!getProfile) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "User profile not found" });
    }

    return res
      .status(StatusCode.OK)
      .json({ message: "User profile", data: getProfile });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({ error: err });
  }
};
