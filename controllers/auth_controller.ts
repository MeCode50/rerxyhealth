import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../enums/status";
import bcrypt from "bcrypt";
import {
  createUserValidation,
  validate_login,
} from "../validations/auth_validations";
import { signJWT } from "../helper/jwt_helper";
import { generateOtp } from "../helper/generate_otp";

const prisma = new PrismaClient();

// Creating new user
const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      country,
      userOption,
      phoneNumber,
      schoolName,
      email,
      password,
    } = req.body;

    await createUserValidation.validate({
      firstName,
      lastName,
      dateOfBirth,
      country,
      userOption,
      phoneNumber,
      schoolName,
      email,
      password,
    });

    const createOtp = generateOtp();
    const hashPassword = await bcrypt.hash(password, 10);

    //check if user already exists
    const userExisted = await prisma.users.findUnique({
      where: { email },
    });

    if (userExisted) {
      res.status(StatusCode.Found).json({
        message: "User already exists",
      });
    }

    const newUser = await prisma.users.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        country: country,
        userOption: userOption,
        phoneNumber: phoneNumber,
        schoolName: schoolName,
        email: email,
        password: hashPassword,
        otp: parseInt(createOtp),
      },
    });

    const { id } = newUser;
    const jwt = signJWT({
      id: id,
    });

    return res.status(StatusCode.Created).json({
      message: "user created successfully",
      jwt: jwt,
      user: newUser,
      otp: createOtp,
    });
  } catch (err) {
    return (
      res
        .status(StatusCode.InternalServerError)
        //@ts-ignore
        .json({ message: err?.message })
    );
  }
};

//login user controller
const loginController = async (req: Request, res: Response) => {
  try {
    const loginbody = req.body;
    const loginDetails = await validate_login.validate(loginbody);

    const { email, password } = loginDetails;
    const userExisted = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExisted) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    const matchPassword = await bcrypt.compare(password, userExisted?.password);

    if (!matchPassword) {
      return res.status(StatusCode.BadRequest).json({
        message: "Incorrect Password",
      });
    }

    const signToken = signJWT({
      id: userExisted?.id,
    });

    return res
      .status(StatusCode.OK)
      .json({ message: "Login successful", jwt: signToken });
  } catch (err) {
    //@ts-ignore
    const errMsg = err?.message;
    return res.status(StatusCode.BadRequest).json({
      error: errMsg,
    });
  }
};

//verify otp
const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const emailExists = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!emailExists) {
      return res.status(StatusCode.NotFound).json({
        message: "Email dosnt exist",
      });
    }

    const { otp: userOtp } = emailExists;
    console.log(userOtp)
    const matchOtp = otp === userOtp;
    if (!matchOtp) {
      return res.status(StatusCode.BadRequest).json({
        message: "Invalid OTP",
      });
    }

    //verifigy email
    await prisma.users
      .update({
        where: { email },
        data: {
          verified: true,
        },
      })
      .then((data) => {
        res.status(StatusCode.OK).json({
          message: "Email verified successfully",
        });
      });
  } catch (err) {
    console.log(err);
  }
};

export { loginController, verifyOtp, createUserController };
