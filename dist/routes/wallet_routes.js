"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const get_wallet_balance_1 = require("../controllers/wallet/get_wallet_balance");
const app = express_1.default.Router();
app.get("/wallet/me", isAuthenticated_1.authenticateUser, get_wallet_balance_1.getWalletBalance);
const walletRouter = app;
exports.default = walletRouter;
