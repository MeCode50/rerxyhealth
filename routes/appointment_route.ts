import express from "express";
import { isAuthenticated, } from "../middleware/isAuthenticated";
import {createAppointment,cancelAppointment,} from "../controllers/appointment/create_appointment_controller";
import {getAppointmentByDate,getUsersAppointment,} from "../controllers/appointment/get_user_appointment";
import { verifyUserToken } from "../middleware/authmiddleware";
const app = express.Router();

app.post("/appointment/create", verifyUserToken, createAppointment);
app.delete("/appointment/cancel/:appointmentId", isAuthenticated, cancelAppointment);

app.get("/appointment/me", isAuthenticated, getUsersAppointment);
app.get("/appointment/:date", isAuthenticated, getAppointmentByDate);

export const appointmentRouter = app;
