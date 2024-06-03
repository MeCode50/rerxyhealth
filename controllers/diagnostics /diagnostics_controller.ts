import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { handleCheckout } from "./checkout";

const handleDiagnosticTests = async (req: Request, res: Response) => {
  try {
    // Retrieve regular tests
    const regularTests = await prisma.diagnosticTest.findMany({
      where: { type: "regular" },
      select: { id: true, name: true, price: true },
    });

    // Retrieve premium tests
    const premiumTests = await prisma.diagnosticTest.findMany({
      where: { type: "premium" },
      select: { id: true, name: true, price: true },
    });

    // Return list of regular and premium tests with their details
    res.status(StatusCode.OK).json({
      regularTests,
      premiumTests,
    });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error retrieving diagnostic tests", error });
  }
};

const createDiagnosticTest = async (req: Request, res: Response) => {
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

const addSelectedTest = async (req: Request, res: Response) => {
  try {
    const { userId, diagnosticTestIds, quantity } = req.body;

    let idsToProcess: string[];

    // to check if diagnostic test is an array 
    if (Array.isArray(diagnosticTestIds)) {
      idsToProcess = diagnosticTestIds;
    } else if (typeof diagnosticTestIds === "string") {
      idsToProcess = [diagnosticTestIds];
    } else {
      return res.status(StatusCode.BadRequest).json({
        message: "Invalid diagnostic test format, expected an array "
      });
    }

    

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "User not found" });
    }

    // Iterate over each selected diagnostic test ID
    for (const diagnosticTestId of diagnosticTestIds) {
      // Check if the diagnostic test exists
      const diagnosticTest = await prisma.diagnosticTest.findUnique({
        where: { id: diagnosticTestId },
      });

      if (!diagnosticTest) {
        return res.status(StatusCode.NotFound).json({
          message: `Diagnostic test with ID ${diagnosticTestId} not found`,
        });
      }

      // Add the selected test to the database
      const selectedTest = await prisma.selectedTest.create({
        data: {
          userId: userId,
          testName: diagnosticTest.name,
          price: diagnosticTest.price,
          quantity: quantity,
          diagnosticTestId: diagnosticTestId,
        },
      });
    }
    res
      .status(StatusCode.Created)
      .json({ message: "Selected tests added successfully" });
  } catch (error) {
    console.error("Error adding selected tests:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error adding selected tests", error });
  }
};

const removeSelectedTest = async (req: Request, res: Response) => {
  try {
    const selectedTestId = req.params.id;

    // Delete the selected test from the user's cart
    await prisma.selectedTest.delete({
      where: { id: selectedTestId },
    });

    res.status(StatusCode.OK).json({ message: "Selected test deleted" });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error removing selected test", error });
  }
};

export {
  handleDiagnosticTests,
  addSelectedTest,
  removeSelectedTest,
  createDiagnosticTest,
};
