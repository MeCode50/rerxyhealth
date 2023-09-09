
import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCode } from "../../../enums/status";

const prisma = new PrismaClient();
export const updateUser =  async ( req: Request , res: Response) => {
    const id = req.params.id
    try {
        const removeUser = await prisma.users.update({
            where: {id}, 
            data: {
                ...req.body
            }
        })
        if  (!removeUser) return res.status(StatusCode.Forbidden).json({
            message: "Failed to edit user"
        })

        return res.status(StatusCode.OK).json({
            message: "User has been updated successfully"
        })
    } catch ( err  ) {
        return err;
    }
}   