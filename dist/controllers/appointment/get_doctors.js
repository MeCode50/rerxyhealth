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
exports.getAllDoctorsByUsers = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getAllDoctorsByUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchDoctors = yield prisma_1.default.doctors.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                specialization: true,
                country: true,
                state: true,
                // Add any other fields that should be visible to regular users
            },
        });
        if (!fetchDoctors) {
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "An error occurred" });
        }
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "Doctors fetched successfully", data: fetchDoctors });
    }
    catch (err) {
        console.error("Error fetching doctors:", err);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "An error occurred" });
    }
});
exports.getAllDoctorsByUsers = getAllDoctorsByUsers;
