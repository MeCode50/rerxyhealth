import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { getUserProfile, updateUserProfile } from "../controllers/profile";
import { get_transaction_pin } from "../controllers/users/get_transaction_pin";

const router = express.Router();

router.get("/profile/me", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, updateUserProfile);
router.get("/profile/transaction_pin" , isAuthenticated, get_transaction_pin)

const profileRouter = router;
export default profileRouter;
