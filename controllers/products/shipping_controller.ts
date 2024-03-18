import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { calculateSubtotal } from "../../helper/priceCalculator"; // You might need to create a utility function for calculating subtotal

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
const handleShippingOptions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      useSavedAddress,
      street,
      localGovernment,
      state,
      totalAmount,
      serviceFee,
    } = req.body;

    if (useSavedAddress) {
      // User chose to use saved address
      const savedAddress = await getSavedAddress(userId);
      const subtotal = calculateSubtotal(
        parseFloat(totalAmount),
        parseFloat(serviceFee),
      );
      // shipping logic using saved address and subtotal
      res.status(StatusCode.OK).json({
        message: "Using saved address for shipping",
        address: savedAddress,
        subtotal,
      });
    } else {
      // Validate input data
      if (
        !street ||
        !localGovernment ||
        !state ||
        !totalAmount ||
        !serviceFee
      ) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Missing required fields" });
      }

      // Calculate subtotal
      const subtotal = calculateSubtotal(
        parseFloat(totalAmount),
        parseFloat(serviceFee),
      );

      // shipping logic using provided address and subtotal
      res.status(StatusCode.OK).json({
        message: "Using other address for shipping",
        address: { street, localGovernment, state },
        subtotal,
      });
    }
  } catch (error) {
    res.status(StatusCode.InternalServerError).json({ message: error });
  }
};

export { handleShippingOptions };
