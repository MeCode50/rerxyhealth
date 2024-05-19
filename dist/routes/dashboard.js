"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_1 = require("../dashboard/superAdmin/appointment");
const products_1 = require("../dashboard/superAdmin/products");
const image_routes_1 = __importDefault(require("./image_routes"));
const app = express_1.default.Router();
// get all users appointment 
image_routes_1.default.get("/user/appointment/:userId", appointment_1.getUserAppointments);
// filter appointment by date 
image_routes_1.default.get("/user/appointment/date", appointment_1.getAppointmentsByDate);
//get all products 
image_routes_1.default.get("/user/products", products_1.getAllProducts);
const superAdminRouter = image_routes_1.default;
exports.default = superAdminRouter;
