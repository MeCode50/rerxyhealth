"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboarding_controller_1 = require("../controllers/onboarding/onboarding_controller");
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const complete_profile_1 = __importDefault(require("../controllers/onboarding/complete_profile"));
const router = express_1.default.Router();
router.post("/onboard/create-pin", isAuthenticated_1.isAuthenticated, onboarding_controller_1.createTransactionPin);
router.post("/onboard/complete-profile", isAuthenticated_1.isAuthenticated, complete_profile_1.default);
const onboardingRouter = router;
exports.default = onboardingRouter;
