import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";

const prisma = new PrismaClient();

const adminGetProduct = async (req:Request, res: Response )=> {
  try {
    const product = await prisma.products.findMany()

    res.status(StatusCode.Found).json({
      message: "Product Found",
      product: product,
    });

  } catch (error) {
    res
    .status(StatusCode.NotFound)
    .json({ message: `Product not Found` });
  }
}

export {adminGetProduct}