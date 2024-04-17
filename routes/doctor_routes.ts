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
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();
// onboarding
router.post('/doctor/signup', signupDoctor)
router.post('/doctor/login', signinDoctor)

//appointment
router.get('/doctor/appointments', getDoctorAppointments); 
router.get('/doctor/appointments/:date', getAppointmentsByDate); 

// mark appointments 
router.put("/appointments/:id/end", AppointmentAsEnded);

//settings 
router.put("/doctor/settings/password", isAuthenticated, updateDoctorPassword);
router.put("/doctor/settings/edit-profile", isAuthenticated, editDoctorProfile);
router.put("/doctor/settings/notification",isAuthenticated,updateNotificationSettings);

// chats


const DoctorthRouter = router;
export default DoctorthRouter;