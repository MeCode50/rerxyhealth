import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validate_create_appointment } from "../../validations/appointment_validation";
import { StatusCode } from "../../enums/status";

const prisma = new PrismaClient();
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
