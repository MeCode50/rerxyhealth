import express from "express";
import { authenticateUser } from "../middleware/isAuthenticated";
import { getUserProfile, updateUserProfile,} from "../controllers/profile";
//import { getUserProfile, updateUserProfile } from "../controllers/profile";
import { get_transaction_pin } from "../controllers/users/get_transaction_pin";
import { verify_transaction_pin } from "../controllers/users/verify_transaction_pin";
import { getDoctorsByUsers } from "../controllers/appointment/get_doctors";
const router = express.Router();

router.get("/profile/me", authenticateUser, getUserProfile);
router.put("/profile/update", authenticateUser, updateUserProfile);
router.get("/profile/transaction_pin", authenticateUser, get_transaction_pin);
router.post("/profile/verify_pin", authenticateUser, verify_transaction_pin);
router.get("/doctors", getDoctorsByUsers);
const profileRouter = router;
export default profileRouter;
