"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_auth_1 = require("../controllers/doctors/doctor_auth");
const appointments_1 = require("../controllers/doctors/appointments");
const settings_1 = require("../controllers/doctors/settings");
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const chat_controller_1 = require("../controllers/doctors/chat_controller");
/*import {
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctors/getAllDoctors";*/
const router = express_1.default.Router();
// onboarding
router.post("/doctor/signup", doctor_auth_1.signupDoctor);
router.post("/doctor/login", doctor_auth_1.signinDoctor);
// get all doctors
//router.get("/doctors", getAllDoctors);
//router.get("/doctors/:id", getDoctorById);
//appointment
router.get("/doctor/appointments", appointments_1.getDoctorAppointments);
router.get("/doctor/appointments/:date", appointments_1.getAppointmentsByDate);
// mark appointments
router.put("/appointments/:id/end", appointments_1.AppointmentAsEnded);
//settings
router.put("/doctor/settings/password", isAuthenticated_1.isAuthenticated, settings_1.updateDoctorPassword);
router.put("/doctor/settings/edit-profile", isAuthenticated_1.isAuthenticated, settings_1.editDoctorProfile);
router.put("/doctor/settings/notification", isAuthenticated_1.isAuthenticated, settings_1.updateNotificationSettings);
// chats
router.post("/doctor/chat/sessions", isAuthenticated_1.isAuthenticated, chat_controller_1.createChatSession);
router.post("/doctor/chat/messages", isAuthenticated_1.isAuthenticated, chat_controller_1.sendMessage);
router.get("/doctor/chat/messages/:sessionId", isAuthenticated_1.isAuthenticated, chat_controller_1.getMessageHistory);
const DoctorthRouter = router;
exports.default = DoctorthRouter;
