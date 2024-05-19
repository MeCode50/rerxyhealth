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
exports.cancelAppointment = exports.completedAppointment = exports.createAppointment = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
const client_1 = require("@prisma/client");
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const requestBody = req.body;
    if (!userId) {
        return res.status(status_1.StatusCode.BadRequest).json({ message: "User ID is required" });
    }
    try {
        const { date, startTime, endTime, period, appointmentType, doctorId } = requestBody;
        if (period !== "Morning" && period !== "Evening") {
            return res.status(status_1.StatusCode.BadRequest).json({ message: "Invalid period" });
        }
        const createAppointment = yield prisma_1.default.appointment.create({
            data: {
                date,
                startTime,
                endTime,
                appointmentType,
                period: period,
                status: client_1.AppointmentStatus.Pending,
                usersId: userId,
                doctorsId: doctorId,
            },
        });
        if (!createAppointment) {
            return res.status(status_1.StatusCode.InternalServerError).json({ message: "Failed to create appointment" });
        }
        return res.status(status_1.StatusCode.Created).json({
            message: "Appointment created successfully", data: createAppointment,
        });
    }
    catch (err) {
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Failed to create appointment" });
    }
});
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
const completedAppointment = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = new Date();
        const completedAppointments = yield prisma_1.default.appointment.findMany({
            where: {
                status: client_1.AppointmentStatus.Pending,
                endTime: {
                    lte: currentTime.toISOString(),
                },
            },
        });
        yield Promise.all;
        completedAppointments.map((appointment) => __awaiter(void 0, void 0, void 0, function* () {
            const endTime = new Date(appointment.endTime);
            if (currentTime >= endTime) {
                console.log("Appointment Start Time: ", appointment.startTime);
                console.log("Appointment End Time: ", appointment.endTime);
                yield prisma_1.default.appointment.update({
                    where: { id: appointment.id },
                    data: { status: client_1.AppointmentStatus.Completed },
                });
                console.log(`Appointment with ID ${appointment.id} has been completed.`);
            }
        }));
        console.log("Pending appointments successfully completed.");
    }
    catch (error) {
        console.error("Error completing appointments:", error);
    }
});
exports.completedAppointment = completedAppointment;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { appointmentId } = req.params;
    try {
        const appointment = yield prisma_1.default.appointment.findFirst({
            where: {
                id: appointmentId,
                usersId: userId,
            },
        });
        if (!appointment) {
            return res.status(status_1.StatusCode.NotFound).json({ message: "Appointment not found or does not belong to the user",
            });
        }
        if (appointment.status === client_1.AppointmentStatus.Cancelled) {
            return res.status(status_1.StatusCode.BadRequest).json({ message: "Appointment is already canceled" });
        }
        const canceledAppointment = yield prisma_1.default.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.Cancelled },
        });
        return res.status(status_1.StatusCode.Success).json({
            message: "Appointment canceled successfully",
            data: canceledAppointment,
        });
    }
    catch (error) {
        console.error("Error canceling appointment:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Failed to cancel appointment" });
    }
});
exports.cancelAppointment = cancelAppointment;
