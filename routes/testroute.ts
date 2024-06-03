import express from "express";
import { transEndpoint } from "../helper/test";

const router = express.Router();

router.get("/verify-transaction/:id", transEndpoint);

const VerifyTrans = router;
export default VerifyTrans;
