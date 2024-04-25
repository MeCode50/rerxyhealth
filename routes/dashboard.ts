import express from "express";
import { getUserAppointments } from "../dashboard/superAdmin/appointment";

const app = express.Router();

app.get("/user/appointment/:userId", getUserAppointments);

const superAdminRouter = app;
export default superAdminRouter;