import { Prisma, PrismaClient } from "@prisma/client";
import { createUserValidation } from "../../../validations/auth_validations";
import { Request , Response } from "express";
import { StatusCode } from "../../../enums/status";
import { generateOtp } from "../../../helper/generate_otp";
import { signJWT } from "../../../helper/jwt_helper";
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const adminCreateUser = async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        country,
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