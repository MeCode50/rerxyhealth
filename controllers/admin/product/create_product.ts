import prisma from "../../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";
import { validate_product } from "../../../validations/product_validation";

const adminCreateProduct = async (req: Request, res: Response) => {
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

    const adminNewProduct = await prisma.products.create({
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
      product: adminNewProduct,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(StatusCode.InternalServerError).json({
        message: "Error creating product",
        error: error.message,
      });
    } else {
      res.status(StatusCode.InternalServerError).json({
        message: "Unknown error occurred",
      });
    }
  }
};
export { adminCreateProduct };
