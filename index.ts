import express, { Application, Response, Request } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";
import cors from "cors";
import authRouter from "./routes/auth_routes";
import onboardingRouter from "./routes/onboarding_routes";
import productRouter from "./routes/product_router";
import profileRouter from "./routes/user";
import walletRouter from "./routes/wallet_routes";
import { appointmentRouter } from "./routes/appointment_route";
import adminRouter from "./routes/admin_route";
import { settings_router } from "./routes/settings_route";
import VerifyTrans from "./routes/testroute";
import diagnosticsRouter from "./routes/diagnostics_routes";
import imageRouter from "./routes/image_routes";
import DoctorthRouter from "./routes/doctor_routes";
import superAdminRouter from "./routes/dashboard";
import path from "path";

require("dotenv").config();

// Routes handlers
const routes = [
  DoctorthRouter,
  authRouter,
  onboardingRouter,
  productRouter,
  profileRouter,
  walletRouter,
  appointmentRouter,
  adminRouter,
  settings_router,
  VerifyTrans,
  diagnosticsRouter,
  imageRouter,
  superAdminRouter,
];

const app: Application = express();
app.use(express.json());
app.use(cors());


// API routes
routes.forEach((route) => {
  app.use("/api", route);
});

// Debugging log for registered routes
app._router.stack.forEach((middleware: { route: { path: any; }; }) => {
  if (middleware.route) {
    console.log(`Registered route: ${middleware.route.path}`);
  }
});

app.get("/api", (req: Request, res: Response) => {
  res
    .status(StatusCode.OK)
    .send(`Welcome to RexHealth. Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
