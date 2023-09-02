//this function helps to get user profile
import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

export const getUserProfile = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  //@ts-ignore
  const id = req?.id;
  try {
    const getProfile = await prisma.users.findUnique({
      where: { id },
    });
  } catch (err) {
    return err;
  }
};
