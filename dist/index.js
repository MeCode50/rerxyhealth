"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const status_1 = require("./enums/status");
const constant_1 = require("./constant");
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const onboarding_routes_1 = __importDefault(require("./routes/onboarding_routes"));
const product_router_1 = __importDefault(require("./routes/product_router"));
const user_1 = __importDefault(require("./routes/user"));
const wallet_routes_1 = __importDefault(require("./routes/wallet_routes"));
const appointment_route_1 = require("./routes/appointment_route");
const admin_route_1 = __importDefault(require("./routes/admin_route"));
const settings_route_1 = require("./routes/settings_route");
const testroute_1 = __importDefault(require("./routes/testroute"));
const diagnostics_routes_1 = __importDefault(require("./routes/diagnostics_routes"));
const image_routes_1 = __importDefault(require("./routes/image_routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor_routes"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
require("dotenv").config();
// Routes handlers
const routes = [
    doctor_routes_1.default,
    auth_routes_1.default,
    onboarding_routes_1.default,
    product_router_1.default,
    user_1.default,
    wallet_routes_1.default,
    appointment_route_1.appointmentRouter,
    admin_route_1.default,
    settings_route_1.settings_router,
    testroute_1.default,
    diagnostics_routes_1.default,
    image_routes_1.default,
    dashboard_1.default,
];
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API routes
routes.forEach((route) => {
    app.use("/api", route);
});
// Debugging log for registered routes
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Registered route: ${middleware.route.path}`);
    }
});
app.get("/api", (req, res) => {
    res
        .status(status_1.StatusCode.OK)
        .send(`Welcome to RexHealth. Server is running on port ${constant_1.PORT}`);
});
app.listen(constant_1.PORT, () => {
    console.log(`Server running on PORT ${constant_1.PORT}`);
});
