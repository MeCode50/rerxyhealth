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
exports.AppointmentAsEnded = exports.getAppointmentsByDate = exports.getDoctorAppointments = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getDoctorAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const doctorId = req === null || req === void 0 ? void 0 : req.id;
    try {
        const doctorAppointments = yield prisma_1.default.appointment.findMany({
            where: {
                doctorsId: doctorId,
            },
            include: {
                user: true,
            },
        });
        if (!doctorAppointments || doctorAppointments.length === 0) {
            return res.status(status_1.StatusCode.NoContent).json({ message: "No appointments for this doctor" });
        }
        return res.status(status_1.StatusCode.OK).json({ message: "Doctor's appointments", data: doctorAppointments });
    }
    catch (error) {
        console.error("Error fetching doctor appointments:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Error fetching doctor appointments" });
    }
});
exports.getDoctorAppointments = getDoctorAppointments;
const getAppointmentsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    //@ts-ignore
    const doctorId = req === null || req === void 0 ? void 0 : req.id;
    try {
        const appointments = yield prisma_1.default.appointment.findMany({
            where: {
                date: date,
                doctorsId: doctorId,
            },
            include: {
                user: true,
            },
        });
        if (!appointments || appointments.length === 0) {
            return res.status(status_1.StatusCode.NoContent).json({ message: `No appointments found for ${date}` });
        }
        return res.status(status_1.StatusCode.OK).json({ message: `Appointments for ${date}`, data: appointments });
    }
    catch (error) {
        console.error("Error fetching appointments by date:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Error fetching appointments by date" });
    }
});
exports.getAppointmentsByDate = getAppointmentsByDate;
const AppointmentAsEnded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield prisma_1.default.appointment.update({
            where: { id },
            data: { hasEnded: true },
        });
        return res.status(status_1.StatusCode.OK).json({ message: "Appointment marked as ended", data: appointment });
    }
    catch (error) {
        console.error("Error marking appointment as ended:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Error marking appointment as ended" });
    }
});
exports.AppointmentAsEnded = AppointmentAsEnded;
