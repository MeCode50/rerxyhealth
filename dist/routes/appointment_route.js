"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const create_appointment_controller_1 = require("../controllers/appointment/create_appointment_controller");
const get_user_appointment_1 = require("../controllers/appointment/get_user_appointment");
const app = express_1.default.Router();
app.post("/appointment/create", isAuthenticated_1.authenticateUser, create_appointment_controller_1.createAppointment);
app.delete("/appointment/cancel/:appointmentId", isAuthenticated_1.authenticateUser, create_appointment_controller_1.cancelAppointment);
app.get("/appointment/me", isAuthenticated_1.authenticateUser, get_user_appointment_1.getUsersAppointmentByUser);
app.get("/appointment/:date", isAuthenticated_1.authenticateUser, get_user_appointment_1.getAppointmentByDate);
app.get("/appointments/upcoming", isAuthenticated_1.authenticateUser, create_appointment_controller_1.getUpcomingAppointments);
app.get("/appointments/past", isAuthenticated_1.authenticateUser, create_appointment_controller_1.getPastAppointments);
exports.appointmentRouter = app;
