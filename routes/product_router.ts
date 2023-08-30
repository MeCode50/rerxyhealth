import express from "express";
import { getAllProduct, createProduct } from "../controllers/products/product_controller";

const router = express.Router()

router.get("/product", getAllProduct)
router.post("/create", createProduct)

const productRouter = router
export default productRouter