"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnostics_controller_1 = require("../controllers/diagnostics /diagnostics_controller");
const router = express_1.default.Router();
router.post("/diagnostic-tests/create", diagnostics_controller_1.createDiagnosticTest);
router.get("/diagnostic/tests", diagnostics_controller_1.handleDiagnosticTests);
router.post("/diagnostic/tests/add", diagnostics_controller_1.addSelectedTest);
router.delete("/diagnostic/tests/delete/:id", diagnostics_controller_1.removeSelectedTest);
const diagnosticsRouter = router;
exports.default = diagnosticsRouter;
