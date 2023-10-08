import express from "express";
import update_password from "../controllers/settings/update_password";
import { isAuthenticated } from "../middleware/isAuthenticated";
import update_phone_number from "../controllers/settings/update_phone_number";

const router = express.Router();

router.put("/settings/update_password", isAuthenticated, update_password);
router.put("/settings/update_number" , isAuthenticated, update_phone_number)

const settings_router = router;
export { settings_router };
