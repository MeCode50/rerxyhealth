import express from "express";
import update_password from "../controllers/settings/update_password";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.put("/settings/update_password", isAuthenticated, update_password);

const settings_router = router;
export { settings_router };
