import express, { Application, Response, Request } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";
import authRouter from "./routes/auth_routes";
import onboardingRouter from "./routes/onboarding_routes";
import cors from "cors";
import productRouter from "./routes/product_router";
import profileRouter from "./routes/user";
import walletRouter from "./routes/wallet_routes";
import { appointmentRouter } from "./routes/appointment_route";
import adminRouter from "./routes/admin_route";
import { settings_router } from "./routes/settings_route";

require("dotenv").config();
//Routes handlers
const routes = [
  authRouter,
  onboardingRouter,
  productRouter,
  profileRouter,
  walletRouter,
  appointmentRouter,
  adminRouter,
  settings_router,
];


const app: Application = express();
app.use(express.json());
app.use(cors());


// API routes
routes.map((items) => {
  app.use("/api", items);
});

app.get("/", (req: Request, res: Response) => {
  res
    .status(StatusCode.OK)
    .send(`Welcome to RexHealth. Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
