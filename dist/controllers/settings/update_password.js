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
const settings_validations_1 = require("../../validations/settings_validations");
const status_1 = require("../../enums/status");
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt = require("bcrypt");
const update_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req === null || req === void 0 ? void 0 : req.id;
    try {
        const { current_password, new_password, confirm_new_password } = req.body;
        const _validate_data = yield settings_validations_1.update_password_schema.validate(req.body);
        const encrypted_new_password = yield bcrypt.hash(new_password, 10);
        //retrive password from user
        const check_user = yield prisma_1.default.users.findUnique({
            where: { id },
        });
        const comparePassword = yield bcrypt.compare(current_password, check_user === null || check_user === void 0 ? void 0 : check_user.password);
        if (!comparePassword) {
            return res.status(status_1.StatusCode.BadRequest).send({
                message: "Password is not correct",
            });
        }
        const compare_new_password = yield bcrypt.compare(new_password, check_user === null || check_user === void 0 ? void 0 : check_user.password);
        if (compare_new_password) {
            return res.status(status_1.StatusCode.BadRequest).send({
                message: "New password cant be same as the current password",
            });
        }
        //update user password
        const updatePassword = yield prisma_1.default.users.update({
            where: { id: id },
            data: {
                password: encrypted_new_password,
            },
        });
        if (!updatePassword) {
            return res.status(status_1.StatusCode.InternalServerError).send({
                message: "Failed to update password",
            });
        }
        return res.status(status_1.StatusCode.OK).send({
            message: "Password has been updated successfully",
        });
    }
    catch (err) {
        //@ts-ignore
        const errMsg = err.message;
        return res.status(status_1.StatusCode.BadRequest).send({
            message: errMsg,
        });
    }
});
exports.default = update_password;
