import express from "express";
import {
  handleDiagnosticTests,
  addSelectedTest,
  removeSelectedTest,
} from "../controllers/diagnostics /diagnostics_controller";

const router = express.Router();
router.get("/diagnostic/tests", handleDiagnosticTests);
router.post("/diagnostic/tests/add", addSelectedTest);
router.delete("/diagnostic/tests/remove/:selectedTestId", removeSelectedTest);

const diagnosticsRouter = router;
export default diagnosticsRouter
