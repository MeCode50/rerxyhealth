import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { StatusCode } from "../enums/status";

const prisma = new PrismaClient();

const createTransactionPin = async (req: Request, res: Response) => {
  const { pin } = req.body;
  //@ts-ignore
  const userId = req.id;
  try {
    const createPin = await prisma.transactionPin.create({
      data: {
        pin: pin,
        user: {
          connect: { id: userId },
        },
      },
    });

    if (!createPin)
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to create pin" });

    return res.status(StatusCode.Created)
    .json({ message: "Pin has been created" });


  } catch (err) {
    return;
  }
};

export { createTransactionPin };
