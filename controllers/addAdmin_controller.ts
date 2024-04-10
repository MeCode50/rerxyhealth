import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/index";
import { StatusCode } from "../enums/status";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await prisma.admin.findFirst({
      where: { email: email },
    });
    if (existingAdmin) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });
    res
      .status(StatusCode.Created)
      .json({ message: "Admin user created", data: newAdmin });
  } catch (error) {
    console.error("Error adding new user", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error adding admin", error });
  }
};

// Approve doctor by admin
const approveDoctor = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    const updatedDoctor = await prisma.doctors.update({
      where: { id: doctorId },
      data: { isApproved: true },
    });

    // Return success response
    res.status(StatusCode.OK).json({ message: "Doctor approved successfully", data: updatedDoctor });
  } catch (error) {
    console.error("Error approving doctor:", error);
    // Return error response
    res.status(StatusCode.InternalServerError).json({ message: "Error approving doctor", error });
  }
};
export { createAdmin, approveDoctor };
