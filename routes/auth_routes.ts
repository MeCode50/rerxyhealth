import express from "express";
import {
  loginController,
  createUserController,
} from "../controllers/auth_controller";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", createUserController);

const authRouter = router;
export default authRouter;
