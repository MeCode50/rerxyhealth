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

export const getAppointmentsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  //@ts-ignore
  const doctorId = req?.id; 
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        day: date,
        doctorsId: doctorId,
      },
      include: {
        user: true,
      },
    });

    if (!appointments || appointments.length === 0) {
      return res.status(StatusCode.NoContent).json({ message: `No appointments found for ${date}` });
    }

    return res.status(StatusCode.OK).json({ message: `Appointments for ${date}`, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Error fetching appointments by date" });
  }
};

export const markAppointmentAsEnded = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { hasEnded: true },
    });

    return res.status(StatusCode.OK).json({ message: "Appointment marked as ended", data: appointment });
  } catch (error) {
    console.error("Error marking appointment as ended:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Error marking appointment as ended" });
  }
};


