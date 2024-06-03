import express from "express";
//import { authenticateUser } from "../middleware/isAuthenticated";
import { verifyUserToken } from "../middleware/authmiddleware";
import { getUserProfile, updateUserProfile,} from "../controllers/profile";
//import { getUserProfile, updateUserProfile } from "../controllers/profile";
import { get_transaction_pin } from "../controllers/users/get_transaction_pin";
import { verify_transaction_pin } from "../controllers/users/verify_transaction_pin";
import { getAllDoctorsByUsers } from "../controllers/appointment/get_doctors";
const router = express.Router();

router.get("/profile/me", verifyUserToken, getUserProfile);
router.put("/profile/update", verifyUserToken, updateUserProfile);
router.get("/profile/transaction_pin", verifyUserToken, get_transaction_pin);
router.post("/profile/verify_pin", verifyUserToken, verify_transaction_pin);
router.get("/doctors", getAllDoctorsByUsers);
const profileRouter = router;
export default profileRouter;
