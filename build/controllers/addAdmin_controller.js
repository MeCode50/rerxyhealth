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
exports.approveDoctor = exports.createAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../prisma/index"));
const status_1 = require("../enums/status");
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingAdmin = yield index_1.default.admin.findFirst({
            where: { email: email },
        });
        if (existingAdmin) {
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "Email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newAdmin = yield index_1.default.admin.create({
            data: { email, password: hashedPassword },
        });
        res
            .status(status_1.StatusCode.Created)
            .json({ message: "Admin user created", data: newAdmin });
    }
    catch (error) {
        console.error("Error adding new user", error);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error adding admin", error });
    }
});
exports.createAdmin = createAdmin;
// Approve doctor by admin
const approveDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId } = req.params;
        const updatedDoctor = yield index_1.default.doctors.update({
            where: { id: doctorId },
            data: { isApproved: true },
        });
        res.status(status_1.StatusCode.OK).json({ message: "Doctor approved successfully", data: updatedDoctor });
    }
    catch (error) {
        console.error("Error approving doctor:", error);
        res.status(status_1.StatusCode.InternalServerError).json({ message: "Error approving doctor", error });
    }
});
exports.approveDoctor = approveDoctor;
