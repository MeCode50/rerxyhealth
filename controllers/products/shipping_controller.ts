import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { calculateSubtotal } from "../../helper/priceCalculator";

// Function to retrieve shipping address from saved user data
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

// Endpoint to handle shipping options
const handleShipping = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { useSavedAddress, street, localGovernment, state } = req.body;

    // Retrieve the cart for the user
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    let totalAmount = 0;
    let serviceFee = 0;

    // Calculate total amount of items in the cart
    for (const item of cartItems) {
      totalAmount += item.amount * item.quantity;
    }

    // Calculate subtotal including shipping fees
    const subtotal = calculateSubtotal(totalAmount, serviceFee);

    if (useSavedAddress) {
      // User chose to use saved address
      const savedAddress = await getSavedAddress(userId);

      // shipping logic using saved address and subtotal
      res.status(StatusCode.OK).json({
        message: "Using saved address for shipping",
        address: savedAddress,
        subtotal,
      });
    } else {
      // Validate input data for provided address
      if (!street || !localGovernment || !state) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Missing required fields" });
      }

      // shipping logic using provided address and subtotal
      res.status(StatusCode.OK).json({
        message: "Using provided address for shipping",
        address: { street, localGovernment, state },
        subtotal,
      });
    }
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling shipping", error });
  }
};

export { handleShipping };
