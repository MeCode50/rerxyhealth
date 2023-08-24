import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { StatusCode } from "../enums/status";
import bcrypt from "bcrypt";
import {
  createUserValidation,
  validate_login,
} from "../validations/auth_validations";
import { signJWT } from "../helper/jwt_helper";
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

    const hashPassword = await bcrypt.hash(password, 10);

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
      },
    });

    const { id } = newUser;
    const jwt = signJWT({
      id: id,
    });

    return res
      .status(StatusCode.Created)
      .json({ message: "user created successfully", jwt: jwt, user: newUser });
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
const verifyOtp = async (req: Request, res: Response) => {};

export { loginController, verifyOtp, createUserController };
