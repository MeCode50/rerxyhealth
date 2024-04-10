import express from "express";
import { signupDoctor, signinDoctor } from "../controllers/doctors/doctor_auth";

const router = express.Router();

router.post('/signup', signupDoctor)
router.post('/login', signinDoctor)


const authRouter = router;
export default authRouter;