import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
  getById,
} from "../controllers/products/product_controller";
import { authenticateUser } from "../middleware/isAuthenticated";
import {
  createCart,
  getAllCart,
  removeCart,
  handleShipping,
} from "../controllers/products/cart_controller";
import {
  createSave,
  getAllSave,
  removeSave,
} from "../controllers/products/savedProductController";

const router = express.Router();

// Product router
router.get("/products", getAllProduct);
router.get("/product/:id", authenticateUser, getById);
router.post("/product/create", createProduct);
router.delete("/product/delete/:id", authenticateUser, deleteProduct);

// Cart router
router.post("/cart/create/:userId/:productId", authenticateUser, createCart);
router.get("/cart", authenticateUser, getAllCart);
router.delete("/cart/remove/:id", authenticateUser, removeCart);

// Save Product router
router.post("/save/create", authenticateUser, createSave);
router.get("/save", authenticateUser, getAllSave);
router.delete("/save/delete/:id", authenticateUser, removeSave);

// shipping route
router.post("/shipping/:userId", authenticateUser, handleShipping);

const productRouter = router;
export default productRouter;
