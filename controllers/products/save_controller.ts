import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { validate_save } from "../../validations/product_validation";

// Get all Save Product
const getAllSave = async (req: Request, res: Response) => {
  try {
    const save = await prisma.saveProduct.findMany();
    res.status(StatusCode.Found).json({
      message: "Save Product Found",
      save: save,
    });
  } catch (error) {
    res.status(StatusCode.NotFound).json({ message: `Product not Found` });
  }
};

// Remove Save Product
const removeSave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removeOne = await prisma.saveProduct.delete({
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

// Create new Cart Item
const createSave = async (req: Request, res: Response) => {
  try {
    const { image, title, amount, delivery, productId, userId } = req.body;
    const {} = req.params;

    await validate_save.validate({
      productId,
      userId,
      image,
      title,
      amount,
      delivery,
    });

    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !product) {
      res.status(StatusCode.NotFound).json({
        message: "User or Product not found",
      });
    }

    const SaveProduct = await prisma.saveProduct.create({
      data: {
        image,
        title,
        amount,
        delivery,
        productId,
        userId,
      },
    });
    res.status(StatusCode.Found).json({
      save: SaveProduct,
    });
  } catch (err) {
    res.status(StatusCode.NotFound).json({
      message: "error message",
    });
  }
};

export { getAllSave, removeSave, createSave };
