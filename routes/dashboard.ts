import express from "express";
import {getUserAppointments,getAppointmentsByDate,} from "../dashboard/superAdmin/appointment";
import { getAllProducts } from "../dashboard/superAdmin/products";
import router from "./image_routes";
const app = express.Router();
// get all users appointment 
router.get("/user/appointment/:userId", getUserAppointments);

// filter appointment by date 
router.get("/user/appointment/date", getAppointmentsByDate);

//get all products 
router.get("/user/products", getAllProducts);

const superAdminRouter = router;
export default superAdminRouter;