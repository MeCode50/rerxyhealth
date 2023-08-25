import express, { Response , Request } from 'express';
import { createTransactionPin } from '../controllers/onboarding_controller';
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = express.Router();

router.post("/onboard/create-pin", isAuthenticated, createTransactionPin)

const onboardingRouter = router;
export default onboardingRouter;