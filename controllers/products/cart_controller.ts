import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { validate_cart } from "../../validations/product_validation";


// Get all Cart Item
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
    // Parse quantity as a number
    // const quantityNumber = parseInt(quantity, 10); // Assuming base 10
    await validate_cart.validate({
      image,
      title,
      amount,
      delivery,
      quantity,
    });
    
    const user = await prisma.users.findUnique({
      //@ts-ignore
      where: { id:userId },
    });

    if (!user) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "User not Found" });
    }
    // check if pdroduct exist
    const product = await prisma.products.findUnique({
      //@ts-ignore
      where: {id: productId },
    });

    if (!product) {
      res.status(StatusCode.NotFound).json({ message: "Product not Found" });
    }

    // Create new Cart Item
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

    // Return the newly created cart item
    res.status(StatusCode.Created).json({
      message: "Cart Item created successfully",
      cartItem: newCart,
    });
  } catch (error:any) {
    // Handle validation error
    if (error.name === 'ValidationError') {
      return res.status(StatusCode.BadRequest).json({ message: error.message });
    }

    // Handle other errors
    console.error("Error creating cart item:", error);
    res.status(StatusCode.InternalServerError).json({ message: "An error occurred while creating the cart item" });
  }
};


    /* await validate_cart.validate({
      image,
      title,
      amount,
      delivery,
      quantity,
    });*/

    /*const newCart = await prisma.cartItem.create({
      // @ts-ignore
      data: {
        image,
        title,
        amount,
        delivery,
        quantity,
      },
    });*/
   /* res.status(StatusCode.Found).json({
      getAllCart: newCart,
    });
  } catch (err) {
    res.status(StatusCode.NotFound).json({
      message: err,
    });
  }*/


// Remove Cart Item
const removeCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removeOne = await prisma.cartItem.delete({
      where: { id },
    });
    res.status(StatusCode.OK).json({
      message: "Delete successfully",
      remove: removeOne,
    });
  } catch (error) {
    res.status(StatusCode.InternalServerError).json({
      message: error,
    });
  }
};

export { createCart, getAllCart, removeCart };
