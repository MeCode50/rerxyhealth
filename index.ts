import express, { Application, Response, Request } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";
import authRouter from "./routes/auth_routes";
import onboardingRouter from "./routes/onboarding_routes";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routes/product_router";
import profileRouter from "./routes/user";
import walletRouter from "./routes/wallet_routes";
import { appointmentRouter } from "./routes/appointment_route";
import adminRouter from "./routes/admin_route";
import { settings_router } from "./routes/settings_route";

require("dotenv").config();

const app: Application = express();
app.use(express.json());
app.use(cors());

// connect to mongodb
mongoose.connect(
  process.env.DATABASE_URL || "mongodb://localhostlocalhost:27017/rexhealth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

  mongoose.connection.on('connected', () => { // Listen for successful connection
  console.log('Connected to MongoDB');
});
  mongoose.connection.on("error", (error: Error) => {
    // Listen for connection errors
    console.error("Error connecting to MongoDB:", error);
  });

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
