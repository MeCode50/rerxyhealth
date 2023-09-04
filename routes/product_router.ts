import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
  getById,
  addToCart,
} from "../controllers/products/product_controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/product", isAuthenticated, getAllProduct);
router.get("/product/:id", isAuthenticated, getById);
router.post("/create", isAuthenticated, createProduct);
router.delete("/product/delete/:id", isAuthenticated, deleteProduct);
router.get("/cart", isAuthenticated, addToCart);

const productRouter = router;
export default productRouter;
