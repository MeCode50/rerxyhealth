"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const profile_1 = require("../controllers/profile");
const get_transaction_pin_1 = require("../controllers/users/get_transaction_pin");
const verify_transaction_pin_1 = require("../controllers/users/verify_transaction_pin");
const router = express_1.default.Router();
router.get("/profile/me", isAuthenticated_1.isAuthenticated, profile_1.getUserProfile);
router.put("/profile/update", isAuthenticated_1.isAuthenticated, profile_1.updateUserProfile);
router.get("/profile/transaction_pin", isAuthenticated_1.isAuthenticated, get_transaction_pin_1.get_transaction_pin);
router.post("/profile/verify_pin", isAuthenticated_1.isAuthenticated, verify_transaction_pin_1.verify_transaction_pin);
const profileRouter = router;
exports.default = profileRouter;
