import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";
import prisma from "../../../prisma";

export const admin_get_all_appointments = async (req: Request,res: Response,) => {
  try {
    const appointments = await prisma.appointment.findMany();

    if (!appointments) {return res.status(StatusCode.InternalServerError).json({ error: "Failed to fetch appointments" });}

    return res.status(StatusCode.OK).json({message: "Appointments fetched successfully",data: appointments,});
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(StatusCode.InternalServerError).json({ error: "Internal server error" });
  }
};
