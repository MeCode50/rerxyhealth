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
exports.handleShipping = exports.removeCart = exports.getAllCart = exports.createCart = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const product_validation_1 = require("../../validations/product_validation");
const priceCalculator_1 = require("../../helper/priceCalculator");
const verify_transaction_1 = require("../../helper/verify_transaction");
// Get all Cart Items
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
        yield product_validation_1.validate_cart.validate({ image, title, amount, delivery, quantity });
        const user = yield prisma_1.default.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "User not Found" });
        }
        const product = yield prisma_1.default.products.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res
                .status(status_1.StatusCode.NotFound)
                .json({ message: "Product not Found" });
        }
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
        res.status(status_1.StatusCode.Created).json({
            message: "Cart Item created successfully",
            cartItem: newCart,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return res.status(status_1.StatusCode.BadRequest).json({ message: error.message });
        }
        console.error("Error creating cart item:", error);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "An error occurred while creating the cart item" });
    }
});
exports.createCart = createCart;
// Remove Cart Item
const removeCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const removeOne = yield prisma_1.default.cartItem.delete({ where: { id } });
        res.status(status_1.StatusCode.OK).json({
            message: "Delete successfully",
            remove: removeOne,
        });
    }
    catch (error) {
        res.status(status_1.StatusCode.InternalServerError).json({ message: error });
    }
});
exports.removeCart = removeCart;
// Retrieve user's saved address
const getSavedAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.users.findUnique({
            where: { id: userId },
            select: { address: true },
        });
        if (!user || !user.address.length) {
            throw new Error("User or address not found");
        }
        return user.address[0]; // Assuming you want the first address
    }
    catch (error) {
        throw error;
    }
});
// Handle shipping
const handleShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { useSavedAddress, street, localGovernment, state, transactionReference, } = req.body;
        const cartItems = yield prisma_1.default.cartItem.findMany({ where: { userId } });
        let totalAmount = 0;
        let serviceFee = 0;
        for (const item of cartItems) {
            totalAmount += item.amount * item.quantity;
        }
        const transactionDetails = yield (0, verify_transaction_1.verifyTransaction)(transactionReference);
        if (transactionDetails && transactionDetails.status) {
            let subtotal = (0, priceCalculator_1.calculateSubtotal)(totalAmount, serviceFee);
            if (useSavedAddress) {
                const savedAddress = yield getSavedAddress(userId);
                res.status(status_1.StatusCode.OK).json({
                    message: "Payment successful",
                    address: savedAddress,
                    subtotal,
                });
            }
            else {
                if (!street || !localGovernment || !state) {
                    return res
                        .status(status_1.StatusCode.BadRequest)
                        .json({ message: "Missing required fields" });
                }
                res.status(status_1.StatusCode.OK).json({
                    message: "Payment successful",
                    address: { street, localGovernment, state },
                    subtotal,
                });
            }
        }
        else {
            res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "Transaction verification failed" });
        }
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error handling shipping", error });
    }
});
exports.handleShipping = handleShipping;
