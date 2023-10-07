import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
  getById,
} from "../controllers/products/product_controller";
// import { isAuthenticated } from "../middleware/isAuthenticated";
import { createCart, getAllCart, removeCart } from "../controllers/products/cart_controller";
import { createSave, getAllSave, removeSave } from "../controllers/products/save_controller";

const router = express.Router();

// Product router
router.get("/product", getAllProduct);
router.get("/product/:id", getById);
router.post("/product/create", createProduct);
router.delete("/product/delete/:id", deleteProduct);

// Cart router
router.post("/cart/create", createCart);
router.get("/cart", getAllCart);
router.delete("/cart/remove/:id", removeCart);

// Save Product router
router.post("/save/create", createSave);
router.get('/save', getAllSave);
router.delete('/save/delete/:id', removeSave)

const productRouter = router;
export default productRouter;
