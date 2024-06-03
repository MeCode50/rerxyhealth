import express, { Request, Response, Router } from "express";
import prisma from "../prisma";
import { StatusCode } from "../enums/status";
import bcrypt from "bcrypt";
import {
  createUserValidation,
  validate_login,
} from "../validations/auth_validations";
import { signJWT } from "../helper/jwt_helper";
import { generateOtp } from "../helper/generate_otp";
import { sendMail } from "../services/nodemailer/mailer";

const createUserController = async (req: Request, res: Response) => {
  try {
    // Validate request body
    await createUserValidation.validate(req.body);

    const {
      firstName,
      lastName,
      dateOfBirth,
      country,
      phoneNumber,
      schoolName,
      email,
      password,
      address,
    } = req.body;

    // Check if user already exists
    const userExists = await prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(StatusCode.Found).json({
        message: "User already exists",
      });
    }

    // Generate OTP and hash password
    const createOtp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        dateOfBirth,
        country,
        phoneNumber,
        schoolName,
        email: email.toLowerCase(),
        password: hashedPassword,
        otp: parseInt(createOtp),
        address: {
          create: address,
        },
      },
      include: {
        address: true,
      },
    });

    // Generate JWT token
    const jwt = signJWT({ id: newUser.id });

    // Prepare user details response
    const userDetails = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      dateOfBirth: newUser.dateOfBirth,
      country: newUser.country,
      phoneNumber: newUser.phoneNumber,
      schoolName: newUser.schoolName,
      address: newUser.address,
    };

    // Return success response
    return res.status(StatusCode.Created).json({
      message: "User created successfully",
      jwt,
      details: userDetails,
      otp: createOtp,
    });
  } catch (error: any) {
    // Handle errors
    console.error(error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: error?.message });
  }
};


//login user controller
const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = await validate_login.validate(req.body);

    const user = await prisma.users.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return res.status(StatusCode.BadRequest).json({
        message: 'Incorrect Password',
      });
    }

    const jwt = signJWT({
      id: user?.id,
    });

    if (!user.verified) {
      const otp = +generateOtp();
      const updatedUser = await prisma.users.update({
        where: { email },
        data: { otp },
      });

      if (!updatedUser) {
        return res.status(StatusCode.InternalServerError).json({
          message: 'Something went wrong',
        });
      }

      return res.status(StatusCode.Forbidden).json({
        message: `The email ${user.email} is not verified, please verify email`,
        otp,
      });
    }

    return res.status(StatusCode.OK).json({
      message: 'Login successful',
      jwt,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCode.BadRequest).json({
      error: error?.message,
    });
  }
};


//verify otp
const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(StatusCode.BadRequest).json({
        message: 'Email is required for OTP verification',
      });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: 'Email does not exist',
      });
    }

    const { otp: userOtp } = user;
    const isOtpValid = +otp === userOtp;

    if (!isOtpValid) {
      return res.status(StatusCode.BadRequest).json({
        message: 'Invalid OTP',
      });
    }

    // Verify email
    await prisma.users.update({
      where: { email },
      data: {
        verified: true,
      },
    });

    return res.status(StatusCode.OK).json({
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCode.InternalServerError).json({
      error: error?.message,
      body: req?.body,
      message: 'An error occurred during OTP verification',
    });
  }
};

export { loginController, verifyOtp, createUserController };
