import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";

const prisma = new PrismaClient();
export const verify_transaction_pin = async (req: Request, res: Response) => {
  const { pin } = req.body;
  //@ts-ignore
  const id = req?.id as string;
  const isExisted = await prisma.users.findUnique({
    where: { id },
    include: {
      TransactionPin: true,
    },
  });

  if (!isExisted) {
    return res.status(StatusCode.NotFound).send({
      message: "No user found",
    });
  }

  const transactionPin = Number(isExisted.TransactionPin?.pin);

  if (Number(pin) !== transactionPin) {
    return res.status(StatusCode.BadRequest).send({
      message: "incorrect transaction Pin",
    });
  }

  return res.status(StatusCode.OK).send({
    message: "Pin matched",
  });

};
