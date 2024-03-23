import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { calculateSubtotal } from "../../helper/priceCalculator";

const getSavedAddress = async (userId: string) => {
  try {
    // Retrieve user's saved address from the database
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        address: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.address;
  } catch (error) {
    throw error;
  }
};

const handleDiagnosticTests = async (req: Request, res: Response) => {
  try {
      // Logic to display diagnostic tests options (regular and premium tests) to the user
      const regularTests = await prisma.diagnosticTest.findMany({
        where: { type: "regular" }, 
        select: { name: true, price: true },
      });

      const premiumTests = await prisma.diagnosticTest.findMany({
        where: { type: "premium" }, 
        select: { name: true, price: true },
      });
      // Return list of regular and premium tests with their prices
       const regularTestsWithPrices = regularTests.map((test) => ({
         name: test.name,
         price: test.price,
       }));

       const premiumTestsWithPrices = premiumTests.map((test) => ({
         name: test.name,
         price: test.price,
       }));

       // Return the structured data as a response
       res.status(StatusCode.OK).json({
         regularTests: regularTestsWithPrices,
         premiumTests: premiumTestsWithPrices,
       });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error retrieving diagnostic tests", error });
  }
};

const handleSelectedTests = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Retrieve the selected tests for the user from the database
    const selectedTests = await prisma.selectedTest.findMany({
      where: {
        userId: userId,
      },
      include: {
        diagnosticTest: true, 
      },
    });

    // Calculate total amount based on selected tests
    let totalAmount = 0;
    for (const selectedTest of selectedTests) {
      totalAmount += selectedTest.diagnosticTest.price * selectedTest.quantity;
    }

    // Return list of selected tests and total amount
    res.status(StatusCode.OK).json({
      selectedTests: selectedTests.map((test) => ({
        name: test.diagnosticTest.name,
        price: test.diagnosticTest.price,
        quantity: test.quantity,
      })),
      totalAmount: totalAmount,
    });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling selected tests", error });
  }
};

const handleTreatmentOptions = async (req:Request ,res:Response) => {
  try {
    const userId = req.params.userId;
    const { useSavedAddress, street, localGovernment, state, selectedTests } =
      req.body;

    // Calculate total amount of selected tests
      let totalAmount = 0;
      let serviceFee = 0;
    for (const test of selectedTests) {
      totalAmount += test.price * test.quantity;
    }

    // Calculate subtotal including shipping/service fees
    const subtotal = calculateSubtotal(totalAmount, serviceFee);

    if (useSavedAddress) {
      const savedAddress = await getSavedAddress(userId);

      // Logic using saved address and subtotal
      res.status(StatusCode.OK).json({
        message: "Using saved address for shipping",
        address: savedAddress,
        subtotal,
      });
    } else {
      // Validate the input data for provided address
      if (!street || !localGovernment || !state) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Missing required fields" });
      }

      res.status(StatusCode.OK).json({
        message: "Using provided address for shipping",
        address: { street, localGovernment, state },
        subtotal,
      });
    }
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling treatment options", error });
  }
};


export { handleDiagnosticTests, handleSelectedTests, handleTreatmentOptions };
