import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { calculateSubtotal } from "../../helper/priceCalculator";
import { verifyTransaction } from "../../helper/verify_transaction"; 

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

const handleShipping = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const {
      useSavedAddress,
      street,
      localGovernment,
      state,
      transactionReference,
    } = req.body; 

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

    //  transaction verification
    const transactionDetails = await verifyTransaction(transactionReference); 
    if (transactionDetails && transactionDetails.status) {
      // proceed with shipping 
      let subtotal = calculateSubtotal(totalAmount, serviceFee);

      if (useSavedAddress) {
        const savedAddress = await getSavedAddress(userId);
        // using saved address and subtotal
        res.status(StatusCode.OK).json({
          message: "Using saved address for shipping",
          address: savedAddress,
          subtotal,
        });
      } else {
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
    } else {
        res
        .status(StatusCode.BadRequest)
        .json({ message: "Transaction verification failed" });
    }
  } catch (error) {
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "Error handling shipping", error });
  }
};

export { handleShipping };
