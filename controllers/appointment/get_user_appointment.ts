import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../../enums/status";

const prisma = new PrismaClient();

export const getUsersAppointment = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req?.id;
  try {
    const getAppointment = await prisma.appointment.findMany({
      where: {
        usersId: userId,
      },
      include: {
        Doctors: false
      }
    });

    if (!getAppointment)
      return res
        .status(StatusCode.NoContent)
        .json({ message: "No Appointments" });
    return res
      .status(StatusCode.OK)
      .json({ message: "My appointments", data: getAppointment });
  } catch (err) {
    return err;
  }
};
