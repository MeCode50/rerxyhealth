import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";
import {
  validate_cart,
  validate_product,
} from "../../validations/product_validation";
import { uploadToCloudinary } from "../../helper/Cloudinary/cloudinary";

// Get all Product
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.products.findMany();
    res.status(StatusCode.Accepted).json({
      message: "Product Found",
      products: product,
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
      product: productId,
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

    // Check if a file is provided in the request
    /*if (!req.file) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "No file uploaded" });
    }

    // upload image to cloudinary
        .status(StatusCode.BadRequest)
        .json({ message: "No file uploaded" });
    }

    // upload image to cloudinary
    const imageUrl = await uploadToCloudinary(req.file);
    const imageUrl = await uploadToCloudinary(req.file);*/

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

export { getAllProduct, createProduct, deleteProduct, getById };
  
  
