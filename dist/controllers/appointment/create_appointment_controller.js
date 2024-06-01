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
exports.getPastAppointments = exports.getUpcomingAppointments = exports.cancelAppointment = exports.completedAppointment = exports.createAppointment = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const status_1 = require("../../enums/status");
``;
const client_1 = require("@prisma/client");
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const requestBody = req.body;
    if (!userId) {
        return res
            .status(status_1.StatusCode.BadRequest)
            .json({ message: "User ID is required" });
    }
    try {
        const { date, startTime, endTime, period, appointmentType, doctorsId } = requestBody;
        if (period !== "Morning" && period !== "Evening") {
            return res
                .status(status_1.StatusCode.BadRequest)
                .json({ message: "Invalid period" });
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
                doctorsId: doctorsId,
            },
        });
        return res.status(status_1.StatusCode.Created).json({
            message: "Appointment created successfully",
            data: createAppointment,
        });
    }
    catch (err) {
        console.error("Error creating appointment:", err); // Log the actual error
        return res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Failed to create appointment" });
    }
});
exports.createAppointment = createAppointment;
/*export const completedAppointment = async () => {
  try {
    const currentTime = new Date();
    console.log(`Current time: ${currentTime}`);

    const completedAppointments = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.Pending,
        endTime: {
          lte: currentTime.toISOString(),
        },
      },
    });

    console.log(
      `Pending appointments to be checked: ${completedAppointments.length}`,
    );

    await Promise.all(
      completedAppointments.map(async (appointment) => {
        const endTime = new Date(appointment.endTime);
        console.log(
          `Checking appointment ID ${appointment.id}: endTime = ${endTime}`,
        );

        if (currentTime >= endTime) {
          console.log(`Completing appointment ID ${appointment.id}`);
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { status: AppointmentStatus.Completed },
          });
          console.log(
            `Appointment with ID ${appointment.id} has been completed.`,
          );
        }
      }),
    );

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
            return res.status(status_1.StatusCode.NotFound).json({
                message: "Appointment not found or does not belong to the user",
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
const getUpcomingAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // @ts-ignore
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    if (!userId) {
        return res.status(status_1.StatusCode.BadRequest).json({ message: "User ID is required" });
    }
    try {
        console.log("Fetching upcoming appointments for user:", userId);
        const currentDateTime = new Date().toISOString();
        console.log("Current DateTime:", currentDateTime);
        const upcomingAppointments = yield prisma_1.default.appointment.findMany({
            where: {
                usersId: userId,
                date: {
                    gte: currentDateTime,
                },
                status: {
                    in: [client_1.AppointmentStatus.Pending],
                },
            },
            orderBy: {
                date: "asc",
            },
        });
        console.log("Upcoming Appointments:", upcomingAppointments);
        return res.status(status_1.StatusCode.Success).json({ message: "Upcoming appointments retrieved successfully",
            data: upcomingAppointments,
        });
    }
    catch (error) {
        console.error("Error retrieving upcoming appointments:", error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: "Failed to retrieve upcoming appointments" });
    }
});
exports.getUpcomingAppointments = getUpcomingAppointments;
const getPastAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    // @ts-ignore
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (!userId) {
        return res
            .status(status_1.StatusCode.BadRequest)
            .json({ message: "User ID is required" });
    }
    try {
        const pastAppointments = yield prisma_1.default.appointment.findMany({
            where: {
                usersId: userId,
                date: {
                    lt: new Date().toISOString(),
                },
                status: client_1.AppointmentStatus.Completed,
            },
            orderBy: {
                date: "desc",
            },
        });
        return res.status(status_1.StatusCode.Success).json({
            message: "Past appointments retrieved successfully",
            data: pastAppointments,
        });
    }
    catch (error) {
        console.error("Error retrieving past appointments:", error);
        return res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Failed to retrieve past appointments" });
    }
});
exports.getPastAppointments = getPastAppointments;
