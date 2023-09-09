import { PrismaClient } from '@prisma/client'
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { validate_save } from '../../validations/product_validation';

const prisma = new PrismaClient()

// Get all Save Product
const getAllSave = async (req: Request, res: Response) => {
  try {
    const save = await prisma.saveProduct.findMany()
    res.status(StatusCode.Found).json({
      message: "Save Product Found",
      save: save,
    });
  } catch (error) {
    res.status(StatusCode.NotFound).json({ message: `Product not Found` });
  }
}

// Remove Cart Item
const removeSave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const removeOne = await prisma.saveProduct.delete({
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

// Create new Cart Item
const createSave = async (req: Request, res: Response) => {
  try {
    const { image, title, amount, delivery } = req.body
    const { productId } = req.params

    const product = await prisma.saveProduct.findUnique({
      //@ts-ignore
      where: { productId }
    });

    if (!product) {
      res.status(StatusCode.NotFound).json({ message: "Product not Found" })
    }

    await validate_save.validate({
      image,
      title,
      amount,
      delivery,
    });

    const newSave = await prisma.saveProduct.create({
      // @ts-ignore
      data: {
        productId,
        image,
        title,
        amount,
        delivery,
      },
    });
    res.status(StatusCode.Found).json({
      created: newSave,
    });

  } catch (err) {
    res.status(StatusCode.NotFound).json({
      message: err,
    });
  }
};

export {getAllSave, removeSave, createSave}