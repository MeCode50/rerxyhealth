// controllers/admin/doctors/get_all_doctors.ts

import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";
import prisma from "../../../prisma";

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const fetchDoctors = await prisma.doctors.findMany();

    if (!fetchDoctors) return res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });

    return res.status(StatusCode.OK).json({ message: "Doctors fetched successfully", data: fetchDoctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
  }
};

export { getAllDoctors };
