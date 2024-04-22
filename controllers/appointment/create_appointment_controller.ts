import prisma  from "../../prisma"
import { Request, Response } from "express";
import { validate_create_appointment } from "../../validations/appointment_validation";
import { StatusCode } from "../../enums/status";
import { AppointmentStatus } from "@prisma/client";


export const createAppointment = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req?.id;
  const requestBody = req.body;
  //test id for now since there is no doctor on the system yet
  const doc = "64f31434c722391bc78dd96b";

  try {
    const validateData =
      await validate_create_appointment.validate(requestBody);
    const { day, time, period, appointmentType, doctorsId } = validateData;

    //check for the period
    if (period !== "Morning" && period !== "Evening") {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "Invalid period" });
    }

    //create period
    const createAppointment = await prisma.appointment.create({
      data: {
        day,
        time,
        appointmentType,
        period: period as "Morning" | "Evening",
        status:AppointmentStatus.Pending,
        usersId: userId,
        doctorsId,
      },
    });

    if (!createAppointment)
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to create appointment" });
    return res.status(StatusCode.Created).json({
      message: "Appointment created successfully",
      data: createAppointment,
    });
  } catch (err) {
    //@ts-ignore
    return res.status(StatusCode.BadRequest).json({ message: err?.message });
  }
};

export const cancelExpiredAppointments = async () => {
  try {
    // Logic to cancel appointments that have expired
    const expiredAppointments = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.Pending,
        // Add condition to filter appointments that have expired (e.g., where time is less than current time)
      },
    });

    // Update status of expired appointments to "Cancelled"
    await Promise.all(
      expiredAppointments.map(async (appointment) => {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { status: AppointmentStatus.Cancelled },
        });
      }),
    );
  } catch (error) {
    console.error("Error cancelling expired appointments:", error);
  }
};
