import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import { validate_product } from "../../validations/product_validation";

const prisma = new PrismaClient();

// Get all Product
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.products.findMany();
    res.status(StatusCode.Found).json({
      message: "Product Found",
      product: product,
    });
  } catch (err) {
    res.status(StatusCode.NotFound).json({ message: `Product not Found` });
  }
};

//  Get product by ID
const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = await prisma.products.findUnique({
      where: { id },
    });
    res.status(StatusCode.OK).json({
      message: "Product ID Working",
      productId: productId,
    });
  } catch (err) {
    res.status(StatusCode.NotModified).json({
      message: err,
    });
  }
};

// Create new Product
const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      image,
      title,
      amount,
      delivery,
      description,
      howToUse,
      quantity,
      productCategory,
    } = req.body;

    await validate_product.validate({
      image,
      title,
      amount,
      delivery,
      description,
      howToUse,
      quantity,
      productCategory,
    });

    const newProduct = await prisma.products.create({
      data: {
        image,
        title,
        amount,
        delivery,
        description,
        howToUse,
        quantity,
        productCategory,
      },
    });

    res.status(StatusCode.Created).json({
      message: "Product created",
      product: newProduct,
    });
  } catch (error) {
    res.status(StatusCode.InternalServerError);
  }
};

// Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteOne = await prisma.products.delete({
      where: { id },
    });
    res.status(StatusCode.OK).json({
      message: "Delete successfully",
      delete: deleteOne,
    });
  } catch (err) {
    res.status(StatusCode.BadRequest).json({
      message: err,
    });
  }
};

// Get all Product Cart
const addToCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req?.id;
    const getAllCart = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(StatusCode.Found).json({
      getAllCart: getAllCart,
    });
  } catch (err) {
    res.status(StatusCode.NotFound).json({
      message: err,
    });
  }
};

export { getAllProduct, createProduct, deleteProduct, getById, addToCart };
