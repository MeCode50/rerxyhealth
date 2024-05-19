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
exports.getAppointmentByDate = exports.getUsersAppointment = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const getUsersAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req === null || req === void 0 ? void 0 : req.id;
    try {
        const getAppointment = yield prisma_1.default.appointment.findMany({
            where: {
                usersId: userId,
            },
            include: {
                Doctors: true,
            },
        });
        if (!getAppointment)
            return res
                .status(status_1.StatusCode.NoContent)
                .json({ message: "No Appointments" });
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "My appointments", data: getAppointment });
    }
    catch (err) {
        return err;
    }
});
exports.getUsersAppointment = getUsersAppointment;
//fiter through appointment
const getAppointmentByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req === null || req === void 0 ? void 0 : req.id;
    const { date } = req.params;
    try {
        const getAppointment = yield prisma_1.default.appointment.findMany({
            where: {
                usersId: userId,
                date: date,
            },
            include: {
                Doctors: false,
            },
        });
        if (!getAppointment)
            return res
                .status(status_1.StatusCode.NoContent)
                .json({ message: `No scheduled appoint for this date ${date}` });
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: `Appoints for ${date}`, data: getAppointment });
    }
    catch (err) {
        return err;
    }
});
exports.getAppointmentByDate = getAppointmentByDate;
