import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { validate_cart } from "../../validations/product_validation";

const prisma = new PrismaClient();

// Get all Cart Item
const getAllCart = async(req:Request, res:Response) =>{
  try {
    const cart = await prisma.cartItem.findMany()
    res.status(StatusCode.Found).json({
      message: "Cart Item Found",
      cart: cart,
    });
  } catch (error) {
    res.status(StatusCode.NotFound).json({ message: `Cart Item not Found` });
  }
}

// Create new Cart Item
const createCart = async (req: Request, res: Response) => {
  try {
    const { image, title, amount, delivery, quantity } = req.body
    const { userId, productId } = req.params

    const user = await prisma.cartItem.findUnique({
      //@ts-ignore
      where: { userId }
    });

    if (!user) {
      return res.status(StatusCode.BadRequest).json({ message: "User not Found" })
    }

    const product = await prisma.cartItem.findUnique({
      //@ts-ignore
      where: { productId }
    });

    if (!product) {
      res.status(StatusCode.NotFound).json({ message: "Product not Found" })
    }

    await validate_cart.validate({
      image,
      title,
      amount,
      delivery,
      quantity,
    });

    const newCart = await prisma.cartItem.create({
      // @ts-ignore
      data: {
        image,
        title,
        amount,
        delivery,
        quantity
      },
    });
    res.status(StatusCode.Found).json({
      getAllCart: newCart,
    });

  } catch (err) {
    res.status(StatusCode.NotFound).json({
      message: err,
    });
  }
};

// Remove Cart Item
const removeCart = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const removeOne = await prisma.cartItem.delete({
      where: { id }
    })
    res.status(StatusCode.OK).json({
      message: "Delete successfully",
      remove: removeOne,
    });
  } catch (error) {
    res.status(StatusCode.InternalServerError).json({
      message: error
    })
  }
}

export {createCart, getAllCart, removeCart}