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
exports.createSave = exports.removeSave = exports.getAllSave = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const product_validation_1 = require("../../validations/product_validation");
// Get all Saved Product
const getAllSave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const save = yield prisma_1.default.saveProduct.findMany();
        res.status(status_1.StatusCode.Found).json({
            message: "Save Product Found",
            save: save,
        });
    }
    catch (error) {
        res.status(status_1.StatusCode.NotFound).json({ message: `Product not Found` });
    }
});
exports.getAllSave = getAllSave;
// Remove Saved Product
const removeSave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const removeOne = yield prisma_1.default.saveProduct.delete({
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
exports.removeSave = removeSave;
// Create new Cart Item
const createSave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, title, amount, delivery, productId, userId } = req.body;
        const {} = req.params;
        yield product_validation_1.validate_save.validate({
            productId,
            userId,
            image,
            title,
            amount,
            delivery,
        });
        const product = yield prisma_1.default.products.findUnique({
            where: {
                id: productId,
            },
        });
        const user = yield prisma_1.default.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user || !product) {
            res.status(status_1.StatusCode.NotFound).json({
                message: "User or Product not found",
            });
        }
        const SaveProduct = yield prisma_1.default.saveProduct.create({
            data: {
                image,
                title,
                amount,
                delivery,
                productId,
                userId,
            },
        });
        res.status(status_1.StatusCode.Found).json({
            save: SaveProduct,
        });
    }
    catch (err) {
        res.status(status_1.StatusCode.NotFound).json({
            message: "error message",
        });
    }
});
exports.createSave = createSave;
