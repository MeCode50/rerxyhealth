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
exports.handleCheckout = void 0;
const status_1 = require("../../enums/status");
const prisma_1 = __importDefault(require("../../prisma"));
const priceCalculator_1 = require("../../helper/priceCalculator");
const handleCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { useSavedAddress, street, localGovernment, state, selectedTests } = req.body;
        // Calculate total price of selected tests
        let totalAmount = 0;
        for (const test of selectedTests) {
            totalAmount += test.price * test.quantity;
        }
        // Handle address options
        let address;
        if (useSavedAddress) {
            // Retrieve saved address from user's profile
            const user = yield prisma_1.default.users.findUnique({
                where: { id: userId },
                select: { address: true },
            });
            if (!user || !user.address) {
                throw new Error("User's address not found");
            }
            address = user.address;
        }
        else {
            // Validate and use provided address
            if (!street || !localGovernment || !state) {
                return res
                    .status(status_1.StatusCode.BadRequest)
                    .json({ message: "Missing required address fields" });
            }
            address = { street, localGovernment, state };
        }
        // Calculate subtotal including shipping/service fees
        const serviceFee = 0; // Placeholder for service fee calculation
        const subtotal = (0, priceCalculator_1.calculateSubtotal)(totalAmount, serviceFee);
        // Return checkout details
        res.status(status_1.StatusCode.OK).json({
            message: useSavedAddress
                ? "Using saved address for shipping"
                : "Using provided address for shipping",
            address,
            totalAmount,
            subtotal,
        });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error handling checkout", error });
    }
});
exports.handleCheckout = handleCheckout;
