import express, { Response, Request } from "express";
import { createTransactionPin } from "../controllers/onboarding/onboarding_controller";
import { authenticateUser } from "../middleware/isAuthenticated";
import completeProfile from "../controllers/onboarding/complete_profile";
const router = express.Router();

router.post("/onboard/create-pin", authenticateUser, createTransactionPin);
router.post("/onboard/complete-profile", authenticateUser, completeProfile);

const onboardingRouter = router;
export default onboardingRouter;
