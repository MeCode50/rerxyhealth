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
exports.updateNotificationSettings = exports.editDoctorProfile = exports.updateDoctorPassword = void 0;
//import { update_password_schema } from "../../validations/settings_validations";
const status_1 = require("../../enums/status");
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt_1 = require("bcrypt");
const updateDoctorPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        const { current_password, new_password, confirm_new_password } = req.body;
        // Validate input data
        /*const validationResult = update_password_schema.validate({
          current_password,
          new_password,
          confirm_new_password,
        });
        if (validationResult.error) {
          return res.status(StatusCode.BadRequest).send({
            message: "Invalid input data",
            details: validationResult.error.details,
          });
        }*/
        if (new_password !== confirm_new_password) {
            return res.status(status_1.StatusCode.BadRequest).send({ message: "Passwords do not match", });
        }
        const doctor = yield prisma_1.default.doctors.findUnique({ where: { id }, });
        if (!doctor) {
            return res.status(status_1.StatusCode.NotFound).send({ message: "Doctor not found", });
        }
        const comparePassword = yield (0, bcrypt_1.compare)(current_password, doctor.password);
        if (!comparePassword) {
            return res.status(status_1.StatusCode.Unauthorized).send({ message: "Current password is incorrect", });
        }
        const compareNewPassword = yield (0, bcrypt_1.compare)(new_password, doctor.password);
        if (compareNewPassword) {
            return res.status(status_1.StatusCode.BadRequest).send({ message: "New password cannot be the same as the current password", });
        }
        const encryptedNewPassword = yield (0, bcrypt_1.hash)(new_password, 10);
        yield prisma_1.default.doctors.update({ where: { id },
            data: { password: encryptedNewPassword, },
        });
        return res.status(status_1.StatusCode.OK).send({ message: "Password has been updated successfully", });
    }
    catch (err) {
        console.error("Error updating password:", err);
        return res.status(status_1.StatusCode.InternalServerError).send({ message: "Failed to update password" });
    }
});
exports.updateDoctorPassword = updateDoctorPassword;
// update doctor  profile 
const editDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        const { firstName, lastName, country, state } = req.body;
        const updatedDoctor = yield prisma_1.default.doctors.update({ where: { id },
            data: {
                firstName,
                lastName,
                country,
                state,
            },
        });
        return res.status(200).json({ message: "Doctor profile updated successfully",
            doctor: updatedDoctor,
        });
    }
    catch (error) {
        console.error("Error updating doctor profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.editDoctorProfile = editDoctorProfile;
const updateNotificationSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        const { soundEnabled, vibrationEnabled, inviteFriendsEnabled } = req.body;
        // update notification in database 
        yield prisma_1.default.doctors.update({
            where: { id },
            data: {
                soundEnabled,
                vibrationEnabled,
                inviteFriendsEnabled
            }
        });
        res.status(200).json({ message: "Notification settings updated successfully" });
    }
    catch (error) {
        console.error("Error updating notification settings:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.updateNotificationSettings = updateNotificationSettings;
