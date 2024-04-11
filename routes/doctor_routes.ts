import express from "express";
import { signupDoctor, signinDoctor } from "../controllers/doctors/doctor_auth";
import {
  getDoctorAppointments,
  getAppointmentsByDate,
  AppointmentAsEnded,
} from "../controllers/doctors/appointments";

const router = express.Router();
// onboarding
router.post('/doctor/signup', signupDoctor)
router.post('/doctor/login', signinDoctor)

//appointment
// Appointment routes
router.get('/doctor/appointments', getDoctorAppointments); 
router.get('/doctor/appointments/:date', getAppointmentsByDate); 

// mark appointments 
router.put("/appointments/:id/end", AppointmentAsEnded);


const DoctorthRouter = router;
export default DoctorthRouter;