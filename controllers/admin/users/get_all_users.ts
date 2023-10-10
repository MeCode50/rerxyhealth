import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const fetchUsers = await prisma.users.findMany();

    if (!fetchUsers)
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "An error occurred" });

    return res
      .status(StatusCode.OK)
      .json({ message: "Users fetched successfully", data: fetchUsers });
  } catch (err) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "An error occurred" });
  }
};

export { getAllUsers };
