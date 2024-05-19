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
exports.createTransactionPin = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const createTransactionPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pin } = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        const createPin = yield prisma_1.default.transactionPin.create({
            data: {
                pin: pin,
                usersId: userId,
            },
        });
        if (!createPin)
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "Failed to create pin" });
        return res
            .status(status_1.StatusCode.Created)
            .json({ message: "Pin has been created" });
    }
    catch (err) {
        console.log(err);
        res.status(status_1.StatusCode.InternalServerError).json({ message: err });
        return err;
    }
});
exports.createTransactionPin = createTransactionPin;
