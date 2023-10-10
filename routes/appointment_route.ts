import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { createAppointment } from "../controllers/appointment/create_appointment_controller";
import {
  getAppointmentByDate,
  getUsersAppointment,
} from "../controllers/appointment/get_user_appointment";

const app = express.Router();

app.post("/appointment/create", isAuthenticated, createAppointment);
app.get("/appointment/me", isAuthenticated, getUsersAppointment);
app.get("/appointment/:date", isAuthenticated, getAppointmentByDate);

export const appointmentRouter = app;
