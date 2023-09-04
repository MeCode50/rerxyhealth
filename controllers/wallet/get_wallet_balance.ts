import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";

const prisma = new PrismaClient();
export const getWalletBalance = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req?.id;
  const getBalance = await prisma.wallet.findUnique({
    where: {
      usersId: userId,
    },
  });

  if (!getBalance)
    return res
      .status(StatusCode.Forbidden)
      .json({ message: "Failed to fetch user wallet" });
  return res
    .status(StatusCode.OK)
    .json({ message: "user balance", data: getBalance });
};
