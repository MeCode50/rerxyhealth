import express from "express";
import { getAllUsers } from "../controllers/admin/users/get_all_users";
import { deleteUser } from "../controllers/admin/users/delete_user";
import { updateUser } from "../controllers/admin/users/edit_user";
import { admin_get_all_appointments } from "../controllers/admin/appointments/admin_all_appointments";

const app = express.Router();

app.get("/admin/users/all", getAllUsers);
app.put("/admin/users/delete/:id", deleteUser);
app.put("/admin/users/edit/:id", updateUser);

//appoint section
app.get("/admin/appointment/all", admin_get_all_appointments);


//product section 




const adminRouter = app;
export default adminRouter;
