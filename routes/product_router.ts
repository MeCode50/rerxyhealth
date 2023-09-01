import express from "express";
import {
  getAllProduct,
  createProduct,
  deleteProduct,
} from "../controllers/products/product_controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/product", isAuthenticated, getAllProduct);
router.post("/create", isAuthenticated, createProduct);
router.delete("/product/id", isAuthenticated, deleteProduct);

const productRouter = router;
export default productRouter;
