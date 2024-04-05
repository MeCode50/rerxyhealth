import express from "express";
import {
  handleDiagnosticTests,
  addSelectedTest,
  removeSelectedTest,
  createDiagnosticTest,
} from "../controllers/diagnostics /diagnostics_controller";

const router = express.Router();
router.post("/diagnostic-tests/create", createDiagnosticTest);
router.get("/diagnostic/tests", handleDiagnosticTests);
router.post("/diagnostic/tests/add", addSelectedTest);
router.delete("/diagnostic/tests/delete/:id", removeSelectedTest);

const diagnosticsRouter = router;
export default diagnosticsRouter
