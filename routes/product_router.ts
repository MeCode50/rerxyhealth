import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
  getById,
} from "../controllers/products/product_controller";
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
} from "../controllers/products/save_controller";

const router = express.Router();

// Product router
router.get("/product", isAuthenticated, getAllProduct);
router.get("/product/:id", isAuthenticated, getById);
router.post("/product/create", isAuthenticated, createProduct);
router.delete("/product/delete/:id", isAuthenticated, deleteProduct);

// Cart router
router.post("/cart/create", isAuthenticated, createCart);
router.get("/cart", isAuthenticated, getAllCart);
router.delete("/cart/remove/:id", isAuthenticated, removeCart);

// Save Product router
router.post("/save/create", isAuthenticated, createSave);
router.get("/save", isAuthenticated, getAllSave);
router.delete("/save/delete/:id", isAuthenticated, removeSave);

const productRouter = router;
export default productRouter;
