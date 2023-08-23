import express, { Request, Response, Router } from "express"
import { PrismaClient } from '@prisma/client'
import * as yup from "yup"
import {StatusCode} from "../enums/status"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// Create user yup input validation
const createUserValidation = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  dateOfBirth: yup.date().required(),
  country: yup.string().required(),
  userOption: yup.string().required(),
  phoneNumber: yup.string().required(),
  schoolName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(12).required()
})


// Creating new user
export const createUser  = async (req: Request, res: Response) =>{
 
  try{
    // Destructing the user object
    const { firstName, lastName, dateOfBirth, country, userOption, phoneNumber, schoolName, email, password } = req.body

    // Validating the user with yup validate
    await createUserValidation.validate({ firstName, lastName, dateOfBirth, country, userOption, phoneNumber, schoolName, email, password })

    // hashing the user password
    const hashPassword = await bcrypt.hash(password, 10)

    // Create new user with prisma and user model
    const newUser = await prisma.users.create({
      data:{
        firstName: firstName, 
        lastName: lastName, 
        dateOfBirth: dateOfBirth, 
        country: country, 
        userOption: userOption, 
        phoneNumber: phoneNumber, 
        schoolName: schoolName, 
        email: email, 
        password: hashPassword
      }
    })

    res
    .status(StatusCode.Created)
    .json({message: "user created successfully"})

  }catch(error){
    res
    .status(StatusCode.InternalServerError)
    .json({message: "Error message"})
  }
}