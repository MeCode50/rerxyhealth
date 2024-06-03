import { Request, Response } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";
const getAllDoctorsByUsers = async (req: Request, res: Response) => {
  try {
    const fetchDoctors = await prisma.doctors.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        country: true,
        state: true,
        // Add any other fields that should be visible to regular users
      },
    });

    if (!fetchDoctors) {
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "An error occurred" });
    }

    return res
      .status(StatusCode.OK)
      .json({ message: "Doctors fetched successfully", data: fetchDoctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "An error occurred" });
  }
};

export { getAllDoctorsByUsers };
