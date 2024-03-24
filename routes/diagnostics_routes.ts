import express from "express";
import {
  handleDiagnosticTests,
  addSelectedTest,
  removeSelectedTest,
} from "../controllers/diagnostics /diagnostics_controller";

const router = express.Router();

// Endpoint to get all diagnostic tests
router.get("/diagnostic/tests", handleDiagnosticTests);

// Endpoint to add a selected test to the user's cart
router.post("/diagnostic/tests/add", addSelectedTest);

// Endpoint to remove a selected test from the user's cart
router.delete("/diagnostic/tests/remove/:selectedTestId", removeSelectedTest);

const diagnosticsRouter = router;
export default diagnosticsRouter
