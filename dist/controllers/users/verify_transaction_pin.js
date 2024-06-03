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
exports.verify_transaction_pin = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const verify_transaction_pin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pin } = req.body;
    //@ts-ignore
    const id = req === null || req === void 0 ? void 0 : req.id;
    const isExisted = yield prisma_1.default.users.findUnique({
        where: { id },
        include: {
            TransactionPin: true,
        },
    });
    if (!isExisted) {
        return res.status(status_1.StatusCode.NotFound).send({
            message: "No user found",
        });
    }
    const transactionPin = Number((_a = isExisted.TransactionPin) === null || _a === void 0 ? void 0 : _a.pin);
    if (Number(pin) !== transactionPin) {
        return res.status(status_1.StatusCode.BadRequest).send({
            message: "incorrect transaction Pin",
        });
    }
    return res.status(status_1.StatusCode.OK).send({
        message: "Pin matched",
    });
});
exports.verify_transaction_pin = verify_transaction_pin;