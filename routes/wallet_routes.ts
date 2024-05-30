import express from "express";
import { authenticateUser } from "../middleware/isAuthenticated";
import { getWalletBalance } from "../controllers/wallet/get_wallet_balance";

const app = express.Router();

app.get("/wallet/me", authenticateUser, getWalletBalance);

const walletRouter = app;
export default walletRouter;
