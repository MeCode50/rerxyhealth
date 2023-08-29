import { profile } from "console";
import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.get('/me', isAuthenticated , profile);

const profileRouter = router;
export default profileRouter