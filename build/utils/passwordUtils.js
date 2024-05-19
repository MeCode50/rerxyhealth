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
exports.updatePassword = void 0;
// utils/passwordUtils.ts
const prisma_1 = __importDefault(require("../prisma"));
const settings_validations_1 = require("../validations/settings_validations");
const bcrypt_1 = __importDefault(require("bcrypt"));
const updatePassword = (id, currentPassword, newPassword, confirmNewPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _validateData = yield settings_validations_1.update_password_schema.validate({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword,
        });
        // Retrieve password from user or doctor
        const entity = yield prisma_1.default.users.findUnique({
            where: { id },
        });
        if (!entity) {
            return { success: false, message: "Entity not found" };
        }
        const comparePassword = yield bcrypt_1.default.compare(currentPassword, entity.password);
        if (!comparePassword) {
            return { success: false, message: "Password is not correct" };
        }
        const compareNewPassword = yield bcrypt_1.default.compare(newPassword, entity.password);
        if (compareNewPassword) {
            return {
                success: false,
                message: "New password cannot be same as the current password",
            };
        }
        const encryptedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update password
        const updatePassword = yield prisma_1.default.users.update({
            where: { id },
            data: {
                password: encryptedNewPassword,
            },
        });
        if (!updatePassword) {
            return { success: false, message: "Failed to update password" };
        }
        return { success: true, message: "Password has been updated successfully" };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
});
exports.updatePassword = updatePassword;
