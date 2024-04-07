import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/index";
import { StatusCode } from "../enums/status";

const addAdmin = async (req: Request, res: Response) => {
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

    // create admin user
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
export { addAdmin };
