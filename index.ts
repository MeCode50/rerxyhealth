import express, { Application, Response, Request } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";
import authRouter from "./routes/auth_routes";
import onboardingRouter from "./routes/onboarding_routes";
import cors from "cors";
import productRouter from "./routes/product_router";

require("dotenv").config();

const app: Application = express();
app.use(express.json());
app.use(cors());

const routes = [authRouter, onboardingRouter, productRouter];

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
