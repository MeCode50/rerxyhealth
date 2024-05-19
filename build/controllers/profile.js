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
exports.updateUserProfile = exports.getUserProfile = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const status_1 = require("../enums/status");
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req === null || req === void 0 ? void 0 : req.id;
    try {
        const getProfile = yield prisma_1.default.users.findUnique({
            where: { id },
            include: {
                TransactionPin: true,
                SetupProfile: true,
                Wallet: true,
            },
        });
        if (!getProfile) {
            return res
                .status(status_1.StatusCode.NotFound)
                .json({ message: "User profile not found" });
        }
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "User profile", data: getProfile });
    }
    catch (err) {
        return res.status(status_1.StatusCode.InternalServerError).json({ error: err });
    }
});
exports.getUserProfile = getUserProfile;
//function to handle profile edit
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req === null || req === void 0 ? void 0 : req.id;
    try {
        const updateProfile = yield prisma_1.default.users.update({
            where: { id },
            data: Object.assign(Object.assign({}, req === null || req === void 0 ? void 0 : req.body), { address: {
                    update: [req === null || req === void 0 ? void 0 : req.body.address],
                } }),
        });
        if (!updateProfile) {
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "Failed to update profile" });
        }
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "Profile has been updated successfully" });
    }
    catch (err) {
        return res.status(status_1.StatusCode.InternalServerError).json({ error: err });
    }
});
exports.updateUserProfile = updateUserProfile;
// come back and fix update profil e postman documentation 
