import { Response, Request } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";



export const getUsersAppointment = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req?.id;
  try {
    const getAppointment = await prisma.appointment.findMany({
      where: {
        usersId: userId,
      },
      include: {
        Doctors: true, // Include the doctor details
      },
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


//fiter through appointment
export const getAppointmentByDate = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req?.id;
  const { date } = req.params;
  try {
    const getAppointment = await prisma.appointment.findMany({
      where: {
        usersId: userId,
        date: date,
      },
      include: {
        Doctors: false,
      },
    });

    if (!getAppointment)
      return res
        .status(StatusCode.NoContent)
        .json({ message: `No scheduled appoint for this date ${date}` });
    return res
      .status(StatusCode.OK)
      .json({ message: `Appoints for ${date}`, data: getAppointment });
  } catch (err) {
    return err;
  }
};
