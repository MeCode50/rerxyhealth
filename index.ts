import express, { Application, Response, Request } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";
import authRouter from "./routes/auth_routes";
import onboardingRouter from "./routes/onboarding_routes";
require("dotenv").config();

const app: Application = express();

app.use(express.json());

// API routes
app.use("/api", authRouter);
app.use("/api", onboardingRouter)

app.get("/", (req: Request, res: Response) => {
  res
    .status(StatusCode.OK)
    .send(`Welcome to RexHealth. Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
