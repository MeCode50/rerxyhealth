import {  PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCode } from "../../enums/status"

const prisma = new PrismaClient()
export const get_transaction_pin =  async (req: Request , res: Response) => {
    //@ts-ignore
    const id = req?.id as string
    const isExisted  = await prisma.users.findUnique({
        where: {id},
        include: {
            TransactionPin: true
        }
    }); 

    if (!isExisted) {
        return res.status(StatusCode.NotFound).send({
            "message": "No user found"
        })
    }

   const transactionPin = isExisted.TransactionPin?.pin; 
   return res.status(StatusCode.Found).send({
    "message": "Transction Pin retrived successfully", 
    "pin": Number(transactionPin)
})


   
}