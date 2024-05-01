import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
  getById,
} from "../controllers/products/product_controller";
import { handleShipping } from "../controllers/products/shipping_controller";
import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  createCart,
  getAllCart,
  removeCart,
} from "../controllers/products/cart_controller";
import {
  createSave,
  getAllSave,
  removeSave,
} from "../controllers/products/savedProductController";

const router = express.Router();

// Product router
router.get("/products", getAllProduct);
router.get("/product/:id", isAuthenticated, getById);
router.post("/product/create", createProduct);
router.delete("/product/delete/:id", isAuthenticated, deleteProduct);

// Cart router
router.post("/cart/create/:userId/:productId", isAuthenticated, createCart);
router.get("/cart", isAuthenticated, getAllCart);
router.delete("/cart/remove/:id", isAuthenticated, removeCart);

// Save Product router
router.post("/save/create", isAuthenticated, createSave);
router.get("/save", isAuthenticated, getAllSave);
router.delete("/save/delete/:id", isAuthenticated, removeSave);

// shipping route
router.post("/shipping/:userId", isAuthenticated, handleShipping);

const productRouter = router;
export default productRouter;
