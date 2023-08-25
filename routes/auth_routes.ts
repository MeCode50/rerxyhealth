import express from "express";
import {
  loginController,
  createUserController,
  verifyOtp,
} from "../controllers/auth_controller";
import { resetTransactionPin } from "../controllers/forgotten_details";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", createUserController);
router.post("/verify-otp", verifyOtp);
router.post("/reset/pin", resetTransactionPin);



const authRouter = router;
export default authRouter;
