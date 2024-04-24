import { Request, Response } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";
import { Appointment } from "@prisma/client";

interface AppointmentResponse {
  pending: Appointment[];
  completed: Appointment[];
  cancelled: Appointment[];
}

export const getUserAppointments = async (req: Request,res: Response,): Promise<void> => {
  const userId = req.params.userId;

try {
const appointments: Appointment[] = await prisma.appointment.findMany({
    where: {usersId: userId,},
});

const categorizedAppointments: AppointmentResponse = {
      pending: [],
      completed: [],
      cancelled: [],
    };

appointments.forEach((appointment) => {
    switch (appointment.status) {
    case "Pending":
    categorizedAppointments.pending.push(appointment);
    break;
    case "Completed":
    categorizedAppointments.completed.push(appointment);
    break;
    case "Cancelled":
    categorizedAppointments.cancelled.push(appointment);
    break;
    default:
    break;
    }
});

    res.status(StatusCode.OK).json(categorizedAppointments);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ error: "Internal server error" });
  }
};
