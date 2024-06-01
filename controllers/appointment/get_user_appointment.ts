import { Response, Request } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";



export const getUsersAppointmentByUser = async (
  req: Request,
  res: Response,
) => {
  //@ts-ignore
  const userId = req?.id;
  try {
    const getAppointment = await prisma.appointment.findMany({
      where: {
        usersId: userId,
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        hasEnded: true,
        period: true,
        status: true,
        appointmentType: true,
        usersId: true,
        doctorsId: true,
        Doctors: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    if (!getAppointment || getAppointment.length === 0) {
      return res
        .status(StatusCode.NoContent)
        .json({ message: "No Appointments" });
    }

    return res
      .status(StatusCode.OK)
      .json({ message: "My appointments", data: getAppointment });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Failed to fetch appointments" });
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
