import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { getUserProfile, updateUserProfile } from "../controllers/profile";

const router = express.Router();

router.get("/profile/me", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, updateUserProfile);

const profileRouter = router;
export default profileRouter;
