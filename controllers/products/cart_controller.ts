import { Request, Response } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";
import { validate_cart } from "../../validations/product_validation";
import { calculateSubtotal } from "../../helper/priceCalculator";
import { verifyTransaction } from "../../helper/verify_transaction";

// Get all Cart Items
const getAllCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cartItem.findMany();
    res.status(StatusCode.Found).json({
      message: "Cart Item Found",
      cart: cart,
    });
  } catch (error) {
    res.status(StatusCode.NotFound).json({ message: `Cart Item not Found` });
  }
};

// Create new Cart Item
const createCart = async (req: Request, res: Response) => {
  try {
    const { image, title, amount, delivery, quantity } = req.body;
    const { userId, productId } = req.params;

    await validate_cart.validate({ image, title, amount, delivery, quantity });

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "User not Found" });
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "Product not Found" });
    }

    const newCart = await prisma.cartItem.create({
      data: {
        image,
        title,
        amount,
        delivery,
        quantity,
        userId,
        productId,
      },
    });

    res.status(StatusCode.Created).json({
      message: "Cart Item created successfully",
      cartItem: newCart,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(StatusCode.BadRequest).json({ message: error.message });
    }
    console.error("Error creating cart item:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: "An error occurred while creating the cart item" });
  }
};

// Remove Cart Item
const removeCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removeOne = await prisma.cartItem.delete({ where: { id } });
    res.status(StatusCode.OK).json({
      message: "Delete successfully",
      remove: removeOne,
    });
  } catch (error) {
    res.status(StatusCode.InternalServerError).json({ message: error });
  }
};

// Retrieve user's saved address
const getSavedAddress = async (userId: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { address: true },
    });
    if (!user || !user.address.length) {
      throw new Error("User or address not found");
    }
    return user.address[0]; // Assuming you want the first address
  } catch (error) {
    throw error;
  }
};

// Handle shipping
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

    const cartItems = await prisma.cartItem.findMany({ where: { userId } });
    let totalAmount = 0;
    let serviceFee = 0;

    for (const item of cartItems) {
      totalAmount += item.amount * item.quantity;
    }

    const transactionDetails = await verifyTransaction(transactionReference);
    if (transactionDetails && transactionDetails.status) {
      let subtotal = calculateSubtotal(totalAmount, serviceFee);

      if (useSavedAddress) {
        const savedAddress = await getSavedAddress(userId);
        res.status(StatusCode.OK).json({
          message: "Payment successful",
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
          message: "Payment successful",
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

export { createCart, getAllCart, removeCart, handleShipping };
