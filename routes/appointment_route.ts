import express from "express";
import { authenticateUser } from "../middleware/isAuthenticated";
import {
  createAppointment,
  cancelAppointment,
  getUpcomingAppointments,
  getPastAppointments,
} from "../controllers/appointment/create_appointment_controller";
import {getAppointmentByDate,getUsersAppointmentByUser,} from "../controllers/appointment/get_user_appointment";
const app = express.Router();

app.post("/appointment/create", authenticateUser, createAppointment);
app.delete("/appointment/cancel/:appointmentId",authenticateUser,cancelAppointment,);

app.get("/appointment/me", authenticateUser, getUsersAppointmentByUser);
app.get("/appointment/:date", authenticateUser, getAppointmentByDate);
app.get("/appointments/upcoming", authenticateUser, getUpcomingAppointments);
app.get("/appointments/past",authenticateUser, getPastAppointments);
export const appointmentRouter = app;
