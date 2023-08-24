import express from "express";
import {
  loginController,
  createUserController,
  verifyOtp,
} from "../controllers/auth_controller";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", createUserController);
router.post("/verify-otp", verifyOtp);

const authRouter = router;
export default authRouter;
