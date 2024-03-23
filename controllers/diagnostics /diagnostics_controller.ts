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
    // Return list of regular and premium tests with their prices
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error retrieving diagnostic tests", error });
  }
};

const handleSelectedTests = async (req: Request, res: Response) => {
  try {
    // Logic to display selected tests to the user
    // Calculate total amount based on the selected tests and their prices
    // Return list of selected tests and total amount
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling selected tests", error });
  }
};

const handleTreatmentOptions = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { useSavedAddress, street, localGovernment, state } = req.body;

    // Retrieve the cart for the user
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
    });

    let totalAmount = 0;
    let serviceFee = 0;

    // Calculate total amount of items in the cart
    for (const item of cartItems) {
      totalAmount += item.amount * item.quantity;
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
