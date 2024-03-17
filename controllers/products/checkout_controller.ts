import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { calculateTotalAmount } from "../../helper/priceCalculator"; // Assuming a function to calculate total amount


// Checkout Cart Items
const checkoutCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Fetch cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(StatusCode.NotFound).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = calculateTotalAmount(cartItems);

    // Additional logic for applying discounts, taxes, etc. can be implemented here

    // Assuming processing payment logic here

    // Clear the cart after successful checkout
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res
      .status(StatusCode.OK)
      .json({ message: "Checkout successful", totalAmount });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "An error occurred during checkout" });
  }
};

export { checkoutCart };
