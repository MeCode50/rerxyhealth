import { Request, Response } from "express";
import prisma from "../../prisma";
import { StatusCode } from "../../enums/status";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await prisma.products.findMany();
    res.status(StatusCode.OK).json({
      message: "Products retrieved successfully",
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(StatusCode.InternalServerError)
      .json({ error: "Internal server error" });
  }
};
