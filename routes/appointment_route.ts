import express from "express";
import { authenticateUser } from "../middleware/isAuthenticated";
import {
  createAppointment,
  cancelAppointment,
  getUpcomingAppointments,
} from "../controllers/appointment/create_appointment_controller";
import {getAppointmentByDate,getUsersAppointment,} from "../controllers/appointment/get_user_appointment";
const app = express.Router();

app.post("/appointment/create", authenticateUser, createAppointment);
app.delete(
  "/appointment/cancel/:appointmentId",authenticateUser,cancelAppointment,
);

app.get("/appointment/me", authenticateUser, getUsersAppointment);
app.get("/appointment/:date", authenticateUser, getAppointmentByDate);
app.get("/appointments/upcoming", authenticateUser, getUpcomingAppointments);

export const appointmentRouter = app;
