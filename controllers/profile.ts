import { Request, Response } from "express";
import prisma from "../prisma";
import { StatusCode } from "../enums/status";
import { Users } from "@prisma/client";

interface AddressCreateInput {
  street?: string;
  city?: string;
  state: string;
  local_government: string;
  usersId: string;
}


export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(StatusCode.Unauthorized).json({ message: "User ID not provided" });
  }

  try {
    const userProfile = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        TransactionPin: true,
        SetupProfile: true,
        Wallet: true,
        address: true,
      },
    });

    if (!userProfile) {
      return res.status(StatusCode.NotFound).json({ message: "User profile not found" });
    }

    return res.status(StatusCode.OK).json({ message: "User profile", data: userProfile });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({ error: err });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  
};