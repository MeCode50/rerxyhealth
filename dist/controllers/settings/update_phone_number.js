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
const settings_validations_1 = require("../../validations/settings_validations");
const status_1 = require("../../enums/status");
const bcrypt = require("bcrypt");
const update_phone_number = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req === null || req === void 0 ? void 0 : req.id;
    try {
        const _validate_data = yield settings_validations_1.update_number_schema.validate(req.body);
        const { new_number, old_number } = _validate_data;
        //check if number matches in the DB
        const checkNumber = yield prisma_1.default.users.findUnique({
            where: { id },
        });
        if (old_number !== (checkNumber === null || checkNumber === void 0 ? void 0 : checkNumber.phoneNumber)) {
            return res.status(status_1.StatusCode.BadRequest).send({
                message: "Current phone number dosnt match",
            });
        }
        //update user password
        const updateNumber = yield prisma_1.default.users.update({
            where: { id: id },
            data: {
                phoneNumber: new_number,
            },
        });
        if (!updateNumber) {
            return res.status(status_1.StatusCode.InternalServerError).send({
                message: "Failed to update Phone number",
            });
        }
        return res.status(status_1.StatusCode.OK).send({
            message: "Phone number has been updated successfully",
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
exports.default = update_phone_number;
