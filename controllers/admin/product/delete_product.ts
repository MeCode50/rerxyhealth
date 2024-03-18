import prisma from "../../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../../enums/status";

const adminDeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteProduct = await prisma.products.delete({
      where: {
        id: id,
      },
    });

    res.status(StatusCode.OK).json({
      message: "Delete successfully",
      delete: deleteProduct,
    });
  } catch (error) {
    res.status(StatusCode.BadRequest).json({
      //@ts-ignore
      message: error?.message,
    });
  }
};

export { adminDeleteProduct };
