/*import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";


const checkoutCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(StatusCode.NotFound).json({ message: "Cart is empty" });
    }

    const totalAmount = calculateTotalAmount(cartItems);



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

export { checkoutCart };*/
