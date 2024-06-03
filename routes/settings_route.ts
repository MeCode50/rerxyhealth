import express from "express";
import { authenticateUser } from "../middleware/isAuthenticated";
import update_password from "../controllers/settings/update_password"
import update_phone_number from "../controllers/settings/update_phone_number";

const router = express.Router();

router.put("/settings/update_password", authenticateUser, update_password);
router.put("/settings/update_number", authenticateUser, update_phone_number);

const settings_router = router;
export { settings_router };
