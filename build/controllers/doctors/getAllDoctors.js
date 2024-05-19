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
exports.getDoctorById = exports.getAllDoctors = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getAllDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma_1.default.doctors.findMany();
        if (!doctors || doctors.length === 0) {
            return res.status(status_1.StatusCode.NoContent).json({ message: "No doctors found" });
        }
        return res.status(status_1.StatusCode.OK).json({ message: "Doctors list", data: doctors });
    }
    catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Error fetching doctors" });
    }
});
exports.getAllDoctors = getAllDoctors;
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorId = req.params.id;
    try {
        const doctor = yield prisma_1.default.doctors.findUnique({
            where: {
                id: doctorId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                password: true,
                specialization: true,
                country: true,
                state: true,
                certificate: true,
                isApproved: true,
            },
        });
        if (!doctor) {
            return res
                .status(status_1.StatusCode.NotFound)
                .json({ message: "Doctor not found" });
        }
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "Doctor details", data: doctor });
    }
    catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Error fetching doctor" });
    }
});
exports.getDoctorById = getDoctorById;
