"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCart = exports.getAllCart = exports.createCart = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const product_validation_1 = require("../../validations/product_validation");
// Get all Cart Item
const getAllCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield prisma_1.default.cartItem.findMany();
        res.status(status_1.StatusCode.Found).json({
            message: "Cart Item Found",
            cart: cart,
        });
    }
    catch (error) {
        res.status(status_1.StatusCode.NotFound).json({ message: `Cart Item not Found` });
    }
});
exports.getAllCart = getAllCart;
// Create new Cart Item
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, title, amount, delivery, quantity } = req.body;
        const { userId, productId } = req.params;
        // Parse quantity as a number
        // const quantityNumber = parseInt(quantity, 10); // Assuming base 10
        yield product_validation_1.validate_cart.validate({
            image,
            title,
            amount,
            delivery,
            quantity,
        });
        const user = yield prisma_1.default.users.findUnique({
            //@ts-ignore
            where: { id: userId },
        });
        if (!user) {
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "User not Found" });
        }
        // check if pdroduct exist
        const product = yield prisma_1.default.products.findUnique({
            //@ts-ignore
            where: { id: productId },
        });
        if (!product) {
            res.status(status_1.StatusCode.NotFound).json({ message: "Product not Found" });
        }
        // Create new Cart Item
        const newCart = yield prisma_1.default.cartItem.create({
            data: {
                image,
                title,
                amount,
                delivery,
                quantity,
                userId,
                productId,
            },
        });
        // Return the newly created cart item
        res.status(status_1.StatusCode.Created).json({
            message: "Cart Item created successfully",
            cartItem: newCart,
        });
    }
    catch (error) {
        // Handle validation error
        if (error.name === 'ValidationError') {
            return res.status(status_1.StatusCode.BadRequest).json({ message: error.message });
        }
        // Handle other errors
        console.error("Error creating cart item:", error);
        res.status(status_1.StatusCode.InternalServerError).json({ message: "An error occurred while creating the cart item" });
    }
});
exports.createCart = createCart;
/* await validate_cart.validate({
  image,
  title,
  amount,
  delivery,
  quantity,
});*/
/*const newCart = await prisma.cartItem.create({
  // @ts-ignore
  data: {
    image,
    title,
    amount,
    delivery,
    quantity,
  },
});*/
/* res.status(StatusCode.Found).json({
   getAllCart: newCart,
 });
} catch (err) {
 res.status(StatusCode.NotFound).json({
   message: err,
 });
}*/
// Remove Cart Item
const removeCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const removeOne = yield prisma_1.default.cartItem.delete({
            where: { id },
        });
        res.status(status_1.StatusCode.OK).json({
            message: "Delete successfully",
            remove: removeOne,
        });
    }
    catch (error) {
        res.status(status_1.StatusCode.InternalServerError).json({
            message: error,
        });
    }
});
exports.removeCart = removeCart;
