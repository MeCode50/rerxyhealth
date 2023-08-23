import express, { Request, Response, Router } from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createUser  = async (req: Request, res: Response) =>{

}