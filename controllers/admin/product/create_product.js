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
exports.adminCreateProduct = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const status_1 = require("../../../enums/status");
const product_validation_1 = require("../../../validations/product_validation");
const adminCreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, title, amount, delivery, description, howToUse, quantity, productCategory, } = req.body;
        yield product_validation_1.validate_product.validate({
            image,
            title,
            amount,
            delivery,
            description,
            howToUse,
            quantity,
            productCategory,
        });
        const adminNewProduct = yield prisma_1.default.products.create({
            data: {
                image,
                title,
                amount,
                delivery,
                description,
                howToUse,
                quantity,
                productCategory,
            },
        });
        res.status(status_1.StatusCode.Created).json({
            message: "Product created",
            product: adminNewProduct,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(status_1.StatusCode.InternalServerError).json({
                message: "Error creating product",
                error: error.message,
            });
        }
        else {
            res.status(status_1.StatusCode.InternalServerError).json({
                message: "Unknown error occurred",
            });
        }
    }
});
exports.adminCreateProduct = adminCreateProduct;
