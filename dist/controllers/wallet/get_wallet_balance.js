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
exports.getWalletBalance = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getWalletBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req === null || req === void 0 ? void 0 : req.id;
    const getBalance = yield prisma_1.default.wallet.findUnique({
        where: {
            usersId: userId,
        },
    });
    if (!getBalance)
        return res
            .status(status_1.StatusCode.Forbidden)
            .json({ message: "Failed to fetch user wallet" });
    return res
        .status(status_1.StatusCode.OK)
        .json({ message: "user balance", data: getBalance });
});
exports.getWalletBalance = getWalletBalance;
