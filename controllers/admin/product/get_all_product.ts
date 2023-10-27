import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";

const prisma = new PrismaClient();

const adminGetProduct = async (req:Request, res: Response )=> {
  try {
    const product = await prisma.products.findMany()

    res.status(StatusCode.Accepted).json({
      message: "Product Found",
      products: product,
    });

  } catch (error) {
    res
    .status(StatusCode.NotFound)
    .json({ message: `Product not Found` });
  }
}

export {adminGetProduct}