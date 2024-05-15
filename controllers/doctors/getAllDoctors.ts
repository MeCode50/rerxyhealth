import { Request, Response } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctors.findMany();

    if (!doctors || doctors.length === 0) {
      return res
        .status(StatusCode.NoContent)
        .json({ message: "No doctors found" });
    }

    return res
      .status(StatusCode.OK)
      .json({ message: "Doctors list", data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error fetching doctors" });
  }
};
