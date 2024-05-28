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
const prisma_1 = __importDefault(require("../../prisma"));
const onboarding_1 = require("../../validations/onboarding");
const status_1 = require("../../enums/status");
const completeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toValidate = req.body;
    //@ts-ignore
    const userId = req === null || req === void 0 ? void 0 : req.id;
    try {
        const validations = yield onboarding_1.validate_completeProfile.validate(toValidate);
        const { username, matricNumber } = validations;
        const completeProfile = yield prisma_1.default.setupProfile.create({
            data: {
                username: username,
                matricNumber: matricNumber,
                usersId: userId,
                //user: { connect: { id: userId } }, 
            },
        });
        if (!completeProfile)
            return res
                .status(status_1.StatusCode.Forbidden)
                .json({ message: "Failed to add data" });
        //create wallet for the user if user has completed account setup
        const createWallet = yield prisma_1.default.wallet.create({
            data: {
                balance: 0,
                usersId: userId,
                //user: { connect: { id: userId } }, // Connect the user ID to the setup profile
            },
        });
        if (!createWallet) {
            res.status(status_1.StatusCode.Forbidden).json({ message: "Wallet created" });
        }
        return res.status(status_1.StatusCode.Created).json({
            message: `Account setup has been completed successfully and wallet has been created for the user`,
            data: completeProfile,
        });
    }
    catch (err) {
        //@ts-ignore
        const errMsg = err === null || err === void 0 ? void 0 : err.message;
        res.status(status_1.StatusCode.BadRequest).json({
            message: errMsg,
        });
    }
    finally {
        prisma_1.default.$disconnect();
    }
});
exports.default = completeProfile;
