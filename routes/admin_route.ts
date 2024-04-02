import express from "express";
import { getAllUsers } from "../controllers/admin/users/get_all_users";
import { deleteUser } from "../controllers/admin/users/delete_user";
import { updateUser } from "../controllers/admin/users/edit_user";
import { admin_get_all_appointments } from "../controllers/admin/appointments/admin_all_appointments";
import { adminCreateProduct } from "../controllers/admin/product/create_product";
import { adminGetProduct } from "../controllers/admin/product/get_all_product";
import { adminDeleteProduct } from "../controllers/admin/product/delete_product";
import {createDiagnosticTest,
  getAllDiagnosticTest,
  getTestById,
  updatedTestById,
  deleteTestBtId,
} from "../controllers/admin/diagnostics/admin_controller"
  

const app = express.Router();

app.get("/admin/users/all", getAllUsers);
app.delete("/admin/users/delete/:id", deleteUser);
app.put("/admin/users/edit/:id", updateUser);

//appoint section
app.get("/admin/appointment/all", admin_get_all_appointments);


// create and delete product images 
//router.post("/product/create", isAuthenticated, upload.single("image"), createProduct);
//router.delete("/product/delete/:id", isAuthenticated, deleteProduct);

//product section 
app.post("/admin/product/create", adminCreateProduct)
app.get("/admin/product/all", adminGetProduct)
app.delete("/admin/product/delete/:id", adminDeleteProduct)

// diagnostic test section 
app.post("/admin/diagnostic/create", createDiagnosticTest);
app.get("/admin/diagnostic/all", getAllDiagnosticTest);
app.get("/admin/diagnostic/:id", getTestById);
app.put("/admin/diagnostic/edit/:id", updatedTestById);
app.delete("/admin/diagnostic/delete/:id", deleteTestBtId);

const adminRouter = app;
export default adminRouter;
