import express from "express";
import { signupDoctor, signinDoctor } from "../controllers/doctors/doctor_auth";
import {
  getDoctorAppointments,
  getAppointmentsByDate,
  AppointmentAsEnded,
} from "../controllers/doctors/appointments";
import {
  updateDoctorPassword,
  editDoctorProfile,
  updateNotificationSettings,
} from "../controllers/doctors/settings";
import { authenticateUser } from "../middleware/isAuthenticated";
import {
  createChatSession,
  sendMessage,
  getMessageHistory,
} from "../controllers/doctors/chat_controller";
/*import {
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctors/getAllDoctors";*/

const router = express.Router();
// onboarding
router.post("/doctor/signup", signupDoctor);
router.post("/doctor/login", signinDoctor);

// get all doctors
//router.get("/doctors", getAllDoctors);
//router.get("/doctors/:id", getDoctorById);

//appointment
router.get("/doctor/appointments", getDoctorAppointments);
router.get("/doctor/appointments/:date", getAppointmentsByDate);

// mark appointments
router.put("/appointments/:id/end", AppointmentAsEnded);

//settings
router.put("/doctor/settings/password", authenticateUser, updateDoctorPassword);
router.put("/doctor/settings/edit-profile", authenticateUser, editDoctorProfile);
router.put(
  "/doctor/settings/notification",
  authenticateUser,
  updateNotificationSettings,
);

// chats
router.post("/doctor/chat/sessions", authenticateUser, createChatSession);
router.post("/doctor/chat/messages", authenticateUser, sendMessage);
router.get(
  "/doctor/chat/messages/:sessionId",
  authenticateUser,
  getMessageHistory,
);

const DoctorthRouter = router;
export default DoctorthRouter;
