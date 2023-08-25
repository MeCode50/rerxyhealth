import express, { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../enums/status";

const prisma = new PrismaClient();
//forgotten transaction pin
const resetTransactionPin = async (res: Response, req: Request) => {
  const { email, pin, confirmPin } = req.body;
  try {
    const userExisted = await prisma.users.findUnique({
      where: { email },
    });

    if (!userExisted) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    // await prisma.users
    //   .update({
    //     where: { email },
    //     data: {
    //       transactionPin: +pin,
    //     },
    //   })
    //   .then((data) => {
    //     return res.status(StatusCode.Created).json({
    //       message: "Pin has be update",
    //     });
    //   })
    //   .catch((err) => {
    //     return;
    //   });
  } catch (err) {
    return;
  }
};

export { resetTransactionPin };
