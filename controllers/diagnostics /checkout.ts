import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { calculateSubtotal } from "../../helper/priceCalculator";


const handleCheckout = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { useSavedAddress, street, localGovernment, state, selectedTests } =
      req.body;

    // Calculate total price of selected tests
    let totalAmount = 0;
    for (const test of selectedTests) {
      totalAmount += test.price * test.quantity;
    }

    // Handle address options
    let address;
    if (useSavedAddress) {
      // Retrieve saved address from user's profile
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { address: true },
      });
      if (!user || !user.address) {
        throw new Error("User's address not found");
      }
      address = user.address;
    } else {
      // Validate and use provided address
      if (!street || !localGovernment || !state) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Missing required address fields" });
      }
      address = { street, localGovernment, state };
    }

    // Calculate subtotal including shipping/service fees
    const serviceFee = 0; // Placeholder for service fee calculation
    const subtotal = calculateSubtotal(totalAmount, serviceFee);

    // Return checkout details
    res.status(StatusCode.OK).json({
      message: useSavedAddress
        ? "Using saved address for shipping"
        : "Using provided address for shipping",
      address,
      totalAmount,
      subtotal,
    });
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling checkout", error });
  }
};

export { handleCheckout };
