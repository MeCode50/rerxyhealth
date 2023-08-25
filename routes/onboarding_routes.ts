import express, { Response , Request } from 'express';
import { createTransactionPin } from '../controllers/onboarding_controller';

const router = express.Router();

router.post("/onboard/create-pin", createTransactionPin)

const onboardingRouter = router;
export default onboardingRouter;