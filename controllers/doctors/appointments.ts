import { Response, Request } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";

export const getDoctorAppointments = async (req: Request, res: Response) => {
  //@ts-ignore
  const doctorId = req?.id; 

  try {
    const doctorAppointments = await prisma.appointment.findMany({
      where: {
        doctorsId: doctorId,
      },
      include: {
        user: true, 
      },
    });

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(StatusCode.NoContent).json({ message: "No appointments for this doctor" });
    }

    return res.status(StatusCode.OK).json({ message: "Doctor's appointments", data: doctorAppointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Error fetching doctor appointments" });
  }
};
