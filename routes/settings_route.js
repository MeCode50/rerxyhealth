"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings_router = void 0;
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const update_password_1 = __importDefault(require("../controllers/settings/update_password"));
const update_phone_number_1 = __importDefault(require("../controllers/settings/update_phone_number"));
const router = express_1.default.Router();
router.put("/settings/update_password", isAuthenticated_1.isAuthenticated, update_password_1.default);
router.put("/settings/update_number", isAuthenticated_1.isAuthenticated, update_phone_number_1.default);
const settings_router = router;
exports.settings_router = settings_router;
