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
exports.handleShipping = void 0;
const status_1 = require("../../enums/status");
const prisma_1 = __importDefault(require("../../prisma"));
const priceCalculator_1 = require("../../helper/priceCalculator");
const verify_transaction_1 = require("../../helper/verify_transaction");
const getSavedAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve user's saved address from the database
        const user = yield prisma_1.default.users.findUnique({
            where: {
                id: userId,
            },
            select: {
                address: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user.address;
    }
    catch (error) {
        throw error;
    }
});
const handleShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { useSavedAddress, street, localGovernment, state, transactionReference, } = req.body;
        const cartItems = yield prisma_1.default.cartItem.findMany({
            where: {
                userId: userId,
            },
        });
        let totalAmount = 0;
        let serviceFee = 0;
        // Calculate total amount of items in the cart
        for (const item of cartItems) {
            totalAmount += item.amount * item.quantity;
        }
        //  transaction verification
        const transactionDetails = yield (0, verify_transaction_1.verifyTransaction)(transactionReference);
        if (transactionDetails && transactionDetails.status) {
            // proceed with shipping
            let subtotal = (0, priceCalculator_1.calculateSubtotal)(totalAmount, serviceFee);
            if (useSavedAddress) {
                const savedAddress = yield getSavedAddress(userId);
                // using saved address and subtotal
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
                    message: "Payment successsful",
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
