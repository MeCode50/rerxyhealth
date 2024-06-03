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
exports.updateUser = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const status_1 = require("../../../enums/status");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const removeUser = yield prisma_1.default.users.update({
            where: { id },
            data: Object.assign({}, req.body),
        });
        if (!removeUser)
            return res.status(status_1.StatusCode.Forbidden).json({
                message: "Failed to edit user",
            });
        return res.status(status_1.StatusCode.OK).json({
            message: "User has been updated successfully",
        });
    }
    catch (err) {
        return err;
    }
});
exports.updateUser = updateUser;
