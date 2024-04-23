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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.completedAppointment = exports.createAppointment = void 0;
var prisma_1 = require("../../prisma");
var status_1 = require("../../enums/status");
var client_1 = require("@prisma/client");
var createAppointment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, requestBody, doc, date, startTime, endTime, period, appointmentType, doctorsId, createAppointment_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req === null || req === void 0 ? void 0 : req.id;
                requestBody = req.body;
                doc = "64f31434c722391bc78dd96b";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                date = requestBody.date, startTime = requestBody.startTime, endTime = requestBody.endTime, period = requestBody.period, appointmentType = requestBody.appointmentType, doctorsId = requestBody.doctorsId;
                // Check for the period
                if (period !== "Morning" && period !== "Evening") {
                    return [2 /*return*/, res
                            .status(status_1.StatusCode.BadRequest)
                            .json({ message: "Invalid period" })];
                }
                return [4 /*yield*/, prisma_1.default.appointment.create({
                        data: {
                            date: date,
                            startTime: startTime,
                            endTime: endTime,
                            appointmentType: appointmentType,
                            period: period,
                            status: client_1.AppointmentStatus.Pending,
                            usersId: userId,
                            doctorsId: doctorsId,
                        },
                    })];
            case 2:
                createAppointment_1 = _a.sent();
                if (!createAppointment_1)
                    return [2 /*return*/, res
                            .status(status_1.StatusCode.InternalServerError)
                            .json({ message: "Failed to create appointment" })];
                return [2 /*return*/, res.status(status_1.StatusCode.Created).json({
                        message: "Appointment created successfully",
                        data: createAppointment_1,
                    })];
            case 3:
                err_1 = _a.sent();
                //@ts-ignore
                return [2 /*return*/, res.status(status_1.StatusCode.BadRequest).json({ message: err_1 === null || err_1 === void 0 ? void 0 : err_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createAppointment = createAppointment;
/*export const completedAppointment = async () => {
  try {
    // Get the current time
    const currentTime = new Date();

    // Logic to update appointments to "Completed"
    const completedAppointments = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.Pending,
        endTime: {
          lt: currentTime.toISOString(),
        },
      },
    });

    // Update status of completed appointments to "Completed"
    await Promise.all(
      completedAppointments.map(async (appointment) => {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { status: AppointmentStatus.Completed },
        });
      }),
    );

    // Log success message after updating appointments
    console.log("Pending appointments successfully completed.");
  } catch (error) {
    console.error("Error completing appointments:", error);
  }
};*/
var completedAppointment = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentTime_1, completedAppointments, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                currentTime_1 = new Date();
                return [4 /*yield*/, prisma_1.default.appointment.findMany({
                        where: {
                            status: client_1.AppointmentStatus.Pending,
                            endTime: {
                                lte: currentTime_1.toISOString(), // Check if end time is equal to or before the current time
                            },
                        },
                    })];
            case 1:
                completedAppointments = _a.sent();
                return [4 /*yield*/, Promise.all];
            case 2:
                _a.sent();
                completedAppointments.map(function (appointment) { return __awaiter(void 0, void 0, void 0, function () {
                    var endTime;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                endTime = new Date(appointment.endTime);
                                if (!(currentTime_1 >= endTime)) return [3 /*break*/, 2];
                                console.log("Appointment Start Time: ", appointment.startTime);
                                console.log("Appointment End Time: ", appointment.endTime);
                                return [4 /*yield*/, prisma_1.default.appointment.update({
                                        where: { id: appointment.id },
                                        data: { status: client_1.AppointmentStatus.Completed },
                                    })];
                            case 1:
                                _a.sent();
                                console.log("Appointment with ID ".concat(appointment.id, " has been completed."));
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                console.log("Pending appointments successfully completed.");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error completing appointments:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.completedAppointment = completedAppointment;
var cancelAppointment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, appointmentId, appointment, canceledAppointment, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req === null || req === void 0 ? void 0 : req.id;
                appointmentId = req.params.appointmentId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_1.default.appointment.findFirst({
                        where: {
                            id: appointmentId,
                            usersId: userId,
                        },
                    })];
            case 2:
                appointment = _a.sent();
                if (!appointment) {
                    return [2 /*return*/, res
                            .status(status_1.StatusCode.NotFound)
                            .json({
                            message: "Appointment not found or does not belong to the user",
                        })];
                }
                // Check if the appointment is already canceled
                if (appointment.status === client_1.AppointmentStatus.Cancelled) {
                    return [2 /*return*/, res
                            .status(status_1.StatusCode.BadRequest)
                            .json({ message: "Appointment is already canceled" })];
                }
                return [4 /*yield*/, prisma_1.default.appointment.update({
                        where: { id: appointmentId },
                        data: { status: client_1.AppointmentStatus.Cancelled },
                    })];
            case 3:
                canceledAppointment = _a.sent();
                return [2 /*return*/, res.status(status_1.StatusCode.Success).json({
                        message: "Appointment canceled successfully",
                        data: canceledAppointment,
                    })];
            case 4:
                error_2 = _a.sent();
                console.error("Error canceling appointment:", error_2);
                return [2 /*return*/, res
                        .status(status_1.StatusCode.InternalServerError)
                        .json({ message: "Failed to cancel appointment" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.cancelAppointment = cancelAppointment;
