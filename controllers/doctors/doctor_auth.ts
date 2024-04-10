import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";
import { signJWT } from "../../helper/jwt_helper";

// Signup  for doctors
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
  } = req.body;

  try {
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
        isApproved: false
        
      },
    });
       const { id } = newDoctor;
      const jwt = signJWT({ id });
      
      const emailDetails = {
        subject: "Welcome to RexHealth 🔥",
        body: { username: firstName },
        template: "email_templates/welcome",
      };


    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error signing up doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Signin  doctors
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
    return res.status(401).json({ message: "Account not yet approved. Please wai for admin approval" })
    };

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: doctor.email, id: doctor.id },"your_secret_key");

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {console.error("Error signing in doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signupDoctor, signinDoctor };
