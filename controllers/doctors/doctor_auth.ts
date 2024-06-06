import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { signJWT } from "../../helper/jwt_helper";
import { sendMail } from "../../services/nodemailer/mailer";
import { StatusCode } from "../../enums/status";

// Signup for doctors
const signupDoctor = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    specialization,
    country,
    state,
    certificate,
    profilePicture,
    yearsOfExperience,
    graduationYear,
    school,
    medicalLicensePicture,
    about,
  } = req.body;

  // Log the entire request body to debug
  console.log("Request body:", req.body);

  try {
    // Check if all required fields are provided
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !specialization ||
      !country ||
      !state ||
      !certificate ||
      !yearsOfExperience ||
      !graduationYear ||
      !school ||
      !medicalLicensePicture
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDoctor = await prisma.doctors.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await prisma.doctors.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        specialization,
        country,
        state,
        certificate,
        profilePicture,
        yearsOfExperience,
        graduationYear,
        school,
        medicalLicensePicture,
        about,
        isApproved: false,
      },
    });

    const { id } = newDoctor;
    const jwt = signJWT({ id });

    const emailDetails = {
      subject: "Welcome to RexHealth 🔥",
      body: { username: firstName },
      template: "email_templates/welcome",
    };
    await sendMail({ email, ...emailDetails });

    res.status(201).json({
      message: "Doctor registered successfully",
      jwt,
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error signing up doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Signin doctors
const signinDoctor = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const doctor = await prisma.doctors.findUnique({
      where: { email },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.isApproved) {
      return res.status(401).json({
        message: "Account not yet approved. Please wait for admin approval",
      });
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwt = signJWT({ id: doctor.id });

    res.status(200).json({ message: "Signin successful", jwt });
  } catch (error) {
    console.error("Error signing in doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setWorkingHours = async (req: Request, res: Response) => {
  const { doctorId, workingHours } = req.body;

  try {
    await prisma.workingHours.deleteMany({
      where: { doctorId },
    });

    const newWorkingHours = await prisma.workingHours.createMany({
      data: workingHours.map((hour: any) => ({
        ...hour,
        doctorId,
      })),
    });

    res.status(StatusCode.OK).json({
      message: "Working hours set successfully",
      data: newWorkingHours,
    });
  } catch (error) {
    console.error("Error setting working hours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signupDoctor, signinDoctor, setWorkingHours };
