//this function helps to get user profile
import { Request, Response } from "express";
import prisma from "../prisma";
import { StatusCode } from "../enums/status";

export const getUserProfile = async (req: Request, res: Response) => {
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

//function to handle profile edit

export const updateUserProfile = async (req: Request, res: Response) => {
  //@ts-ignore
  const id = req?.id;

  try {
    const updateProfile = await prisma.users.update({
      where: { id },
      data: {
        ...req?.body,
        address: {
          update: [req?.body.address], 
        },
      },
    });

    if (!updateProfile) {
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to update profile" });
    }

    return res
      .status(StatusCode.OK)
      .json({ message: "Profile has been updated successfully" });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({ error: err });
  }
};
// come back and fix update profil e postman documentation 
