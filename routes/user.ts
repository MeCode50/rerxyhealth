
import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { getUserProfile } from "../controllers/profile";

const router = express.Router();

router.get("/profile/me", isAuthenticated, getUserProfile);

const profileRouter = router;
export default profileRouter;
