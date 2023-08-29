import express, { Response, Request } from "express";
import { createTransactionPin } from "../controllers/onboarding/onboarding_controller";
import { isAuthenticated } from "../middleware/isAuthenticated";
import completeProfile from "../controllers/onboarding/complete_profile";
const router = express.Router();

router.post("/onboard/create-pin", isAuthenticated, createTransactionPin);
router.post("onboard/completeProfile", isAuthenticated, completeProfile);

const onboardingRouter = router;
export default onboardingRouter;
