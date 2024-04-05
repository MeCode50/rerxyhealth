/*
import prisma from "../../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";

// create test 
cconst createDiagnosticTest = async (req: Request, res: Response) => {
  try {
    const { tests } = req.body;

    const createdTests = await Promise.all(
      tests.map(async (test: any) => {
        const { name, price, type } = test;
        // Check if the provided test type is valid
        if (type !== "regular" && type !== "premium") {
          return res.status(StatusCode.BadRequest).json({
            message:
              "Invalid test type. Test type must be 'regular' or 'premium'.",
          });
        }

        // Create the diagnostic test
        const diagnosticTest = await prisma.diagnosticTest.create({
          data: {
            name,
            price,
            type,
          },
        });

        return diagnosticTest;
      }),
    );

    res.status(StatusCode.Created).json({ tests: createdTests });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error creating diagnostic test", error });
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

//update a test by Id
const updatedTestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        //update a single test 
        const { name, price, categoryId, type } = req.body;

        const updateTest = await prisma.diagnosticTest.update({
            where: { id, },
            data: { name, price, categoryId , type},
            include: { category: true, },
        });
        res.status(StatusCode.OK).json({ updateTest })
    } catch (error) {
        res.status(StatusCode.InternalServerError).json({ message: "failed to update test", error })
        
    }
}

// delete test by id 
const deleteTestBtId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // delete test from database
        await prisma.diagnosticTest.delete({ where: { id, } });
        res.status(StatusCode.OK).json({ message: "diagnostic test deleted" })
    } catch (error) {
        res.status(StatusCode.InternalServerError).json({ message: 'Error deleting test', error })
    }
};

export {
  createDiagnosticTest,
  getAllDiagnosticTest,
  getTestById,
  updatedTestById,
  deleteTestBtId,
};
*/
