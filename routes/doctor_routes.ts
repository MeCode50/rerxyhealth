import express from "express";
import { signupDoctor, signinDoctor } from "../controllers/doctors/doctor_auth";

const router = express.Router();

router.post('/doctor/signup', signupDoctor)
router.post('/doctor/login', signinDoctor)


const DoctorthRouter = router;
export default DoctorthRouter;