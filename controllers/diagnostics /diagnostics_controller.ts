import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";

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

const addSelectedTest = async (req: Request, res: Response) => {
  try {
    const { userId, diagnosticTestId, quantity } = req.body;

    // Check if the user and diagnostic test exist
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    const diagnosticTest = await prisma.diagnosticTest.findUnique({
      where: { id: diagnosticTestId },
      include: { category: true }, 
    });

    if (!user || !diagnosticTest) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "User or diagnostic test not found" });
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

    res.status(StatusCode.Created).json(selectedTest);
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error adding selected test", error });
  }
};

const removeSelectedTest = async (req: Request, res: Response) => {
  try {
    const selectedTestId = req.params.selectedTestId;

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

export { handleDiagnosticTests, addSelectedTest, removeSelectedTest };
