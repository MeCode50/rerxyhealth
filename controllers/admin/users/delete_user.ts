import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../../../enums/status";

const prisma = new PrismaClient();
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const removeUser = await prisma.users.update({
      where: { id },
      data: {
        //using soft delete
        isDeleted: false,
      },
    });
    if (!removeUser)
      return res.status(StatusCode.Forbidden).json({
        message: "Failed to deleted user",
      });

    return res.status(StatusCode.OK).json({
      message: "User has been deleted successfully",
    });
  } catch (err) {
    return err;
  }
};
