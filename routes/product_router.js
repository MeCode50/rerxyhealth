"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/products/product_controller");
const shipping_controller_1 = require("../controllers/products/shipping_controller");
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const cart_controller_1 = require("../controllers/products/cart_controller");
const savedProductController_1 = require("../controllers/products/savedProductController");
const router = express_1.default.Router();
// Product router
router.get("/products", product_controller_1.getAllProduct);
router.get("/product/:id", isAuthenticated_1.isAuthenticated, product_controller_1.getById);
router.post("/product/create", product_controller_1.createProduct);
router.delete("/product/delete/:id", isAuthenticated_1.isAuthenticated, product_controller_1.deleteProduct);
// Cart router
router.post("/cart/create/:userId/:productId", isAuthenticated_1.isAuthenticated, cart_controller_1.createCart);
router.get("/cart", isAuthenticated_1.isAuthenticated, cart_controller_1.getAllCart);
router.delete("/cart/remove/:id", isAuthenticated_1.isAuthenticated, cart_controller_1.removeCart);
// Save Product router
router.post("/save/create", isAuthenticated_1.isAuthenticated, savedProductController_1.createSave);
router.get("/save", isAuthenticated_1.isAuthenticated, savedProductController_1.getAllSave);
router.delete("/save/delete/:id", isAuthenticated_1.isAuthenticated, savedProductController_1.removeSave);
// shipping route
router.post("/shipping/:userId", isAuthenticated_1.isAuthenticated, shipping_controller_1.handleShipping);
const productRouter = router;
exports.default = productRouter;
