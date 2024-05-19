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
exports.getById = exports.deleteProduct = exports.createProduct = exports.getAllProduct = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const product_validation_1 = require("../../validations/product_validation");
// Get all Product
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_1.default.products.findMany();
        res.status(status_1.StatusCode.Accepted).json({
            message: "Product Found",
            products: product,
        });
    }
    catch (err) {
        res.status(status_1.StatusCode.NotFound).json({ message: `Product not Found` });
    }
});
exports.getAllProduct = getAllProduct;
//  Get product by ID
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productId = yield prisma_1.default.products.findUnique({
            where: { id },
        });
        res.status(status_1.StatusCode.OK).json({
            message: "Product ID Working",
            product: productId,
        });
    }
    catch (err) {
        res.status(status_1.StatusCode.NotModified).json({
            message: err,
        });
    }
});
exports.getById = getById;
// Create new Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, title, amount, delivery, description, howToUse, quantity, productCategory, } = req.body;
        // Check if a file is provided in the request
        /*if (!req.file) {
          return res
            .status(StatusCode.BadRequest)
            .json({ message: "No file uploaded" });
        }
    
        // upload image to cloudinary
            .status(StatusCode.BadRequest)
            .json({ message: "No file uploaded" });
        }
    
        // upload image to cloudinary
        const imageUrl = await uploadToCloudinary(req.file);
        const imageUrl = await uploadToCloudinary(req.file);*/
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
        const newProduct = yield prisma_1.default.products.create({
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
            product: newProduct,
        });
    }
    catch (error) {
        res.status(status_1.StatusCode.InternalServerError);
    }
});
exports.createProduct = createProduct;
// Delete Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteOne = yield prisma_1.default.products.delete({
            where: { id },
        });
        res.status(status_1.StatusCode.OK).json({
            message: "Delete successfully",
            delete: deleteOne,
        });
    }
    catch (err) {
        res.status(status_1.StatusCode.BadRequest).json({
            message: err,
        });
    }
});
exports.deleteProduct = deleteProduct;
