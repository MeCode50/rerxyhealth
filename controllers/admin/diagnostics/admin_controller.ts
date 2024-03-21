import prisma from "../../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";

// create test 
const createDiagnosticTest = async (req: Request, res: Response) => {
    try {
        const { name, price, categoryId } = req.body;

        //validate data entered 
        if (!name || !price || !categoryId) {
            return res.status(StatusCode.BadRequest).json({ message: 'Missing required field' });
        }

        // create test 
        const diagnosticTest = await prisma.diagnosticTest.create({
            data: {
                name,
                price,
                categoryId,
            },
        });
        res.status(StatusCode.Created).json({ diagnosticTest });
    } catch (error) {
        res.status(StatusCode.InternalServerError).json({ message: "Error creating diagnostic test", error })
    }
};