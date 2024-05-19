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
exports.getAppointmentsByDate = exports.getUserAppointments = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getUserAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const appointments = yield prisma_1.default.appointment.findMany({
            where: { usersId: userId, },
        });
        const categorizedAppointments = {
            pending: [],
            completed: [],
            cancelled: [],
        };
        appointments.forEach((appointment) => {
            switch (appointment.status) {
                case "Pending":
                    categorizedAppointments.pending.push(appointment);
                    break;
                case "Completed":
                    categorizedAppointments.completed.push(appointment);
                    break;
                case "Cancelled":
                    categorizedAppointments.cancelled.push(appointment);
                    break;
                default:
                    break;
            }
        });
        res.status(status_1.StatusCode.OK).json(categorizedAppointments);
    }
    catch (error) {
        console.error("Error fetching user appointments:", error);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ error: "Internal server error" });
    }
});
exports.getUserAppointments = getUserAppointments;
const getAppointmentsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    try {
        const appointments = yield prisma_1.default.appointment.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
        });
        res.status(status_1.StatusCode.OK).json(appointments);
    }
    catch (error) {
        console.error("Error fetching appointments by date:", error);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ error: "Internal server error" });
    }
});
exports.getAppointmentsByDate = getAppointmentsByDate;
