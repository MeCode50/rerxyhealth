import { PrismaClient } from "@prisma/client";
import {Request, Response} from "express"
import { StatusCode } from "../../enums/status";
import { validate_product } from "../../validations/product_validation";

const prisma = new PrismaClient

// Get all Product
const getAllProduct = async(req:Request, res:Response)=>{
  try{
    const product = await prisma.products.findMany()
    res
    .status(StatusCode.Found)
    .json({
      message: "Product Found",
      product: product
    })
  }catch(err){
    res
    .status(StatusCode.NotFound)
    .json({message: `Product not Found ${err}`})
  }
}

// Create new Product 
const createProduct = async(req:Request, res:Response)=>{
  try{
    const {
      image,
      title,
      amount,
      delivery,
      description,
      howToUse,
      quantity,
      productCategory
    } = req.body

    await validate_product.validate({
      image,
      title,
      amount,
      delivery,
      description,
      howToUse,
      quantity,
      productCategory
    })

    const newProduct = await prisma.products.create({
      data: {
        image,
        title,
        amount,
        delivery,
        description,
        howToUse,
        quantity,
        productCategory
      }
    })

    res
    .status(StatusCode.Created)
    .json({
      message: "Product created",
      product: newProduct
    })

  }catch(error){
    res
      .status(StatusCode.InternalServerError)
  }
}

// Delete Product
const deleteProduct = async (req:Request, res:Response)=>{
  try{
    const { id } = req.body
    const deleteOne = await prisma.products.delete({
      where: { id }
    })
  }catch(err){
    
  }
}

export {getAllProduct, createProduct}