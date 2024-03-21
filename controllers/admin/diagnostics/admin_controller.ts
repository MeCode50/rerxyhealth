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
// retrieve all diagnostic tests
const getAllDiagnosticTest = async (req: Request, res: Response) => {
    try {
        const diagnosticTests = await prisma.diagnosticTest.findMany({
            include: {
                category: true,
            },
        });
        res.status(StatusCode.OK).json({ diagnosticTests });
    } catch (error) {
        res.status(StatusCode.InternalServerError).json({ message: 'Error retrieving the diagnostic tests', error })
    }
};

// retrieve a test by Id
const getTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
// retrieve a single test 
        const diagnosticTest = await prisma.diagnosticTest.findUnique({
            where:
                { id, }, include: { category: true, }
        });
        if (!diagnosticTest) {
            return res.status(StatusCode.NotFound).json({ message: "Diagnostic test not found" });
        }res.status(StatusCode.OK).json({ diagnosticTest });
    } catch (error) {
        res.status(StatusCode.InternalServerError).json({message:"Error retrieving diagnostic test", error})              
    }
}

