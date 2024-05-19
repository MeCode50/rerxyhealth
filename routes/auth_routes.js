"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth_controller");
const forgotten_details_1 = require("../controllers/users/forgotten_details");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.loginController);
router.post("/register", auth_controller_1.createUserController);
router.post("/verify-otp", auth_controller_1.verifyOtp);
router.post("/reset/pin", forgotten_details_1.resetTransactionPin);
const authRouter = router;
exports.default = authRouter;
