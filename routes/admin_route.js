"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_all_users_1 = require("../controllers/admin/users/get_all_users");
const delete_user_1 = require("../controllers/admin/users/delete_user");
const edit_user_1 = require("../controllers/admin/users/edit_user");
const admin_all_appointments_1 = require("../controllers/admin/appointments/admin_all_appointments");
const create_product_1 = require("../controllers/admin/product/create_product");
const get_all_product_1 = require("../controllers/admin/product/get_all_product");
const delete_product_1 = require("../controllers/admin/product/delete_product");
const addAdmin_controller_1 = require("../controllers/addAdmin_controller");
const admin_controller_1 = require("../controllers/admin/diagnostics/admin_controller");
const app = express_1.default.Router();
// add admin 
app.post("/admin/user/add", addAdmin_controller_1.createAdmin);
app.get("/admin/users/all", get_all_users_1.getAllUsers);
app.delete("/admin/users/delete/:id", delete_user_1.deleteUser);
app.put("/admin/users/edit/:id", edit_user_1.updateUser); // will do this later
//appoint section
app.get("/admin/appointment/all", admin_all_appointments_1.admin_get_all_appointments);
//product section 
app.post("/admin/product/create", create_product_1.adminCreateProduct);
app.get("/admin/product/all", get_all_product_1.adminGetProduct);
app.delete("/admin/product/delete/:id", delete_product_1.adminDeleteProduct);
// diagnostic test section 
app.post("/admin/diagnostic/create", admin_controller_1.createDiagnosticTest);
app.get("/admin/diagnostic/all", admin_controller_1.getAllDiagnosticTest);
app.get("/admin/diagnostic/:id", admin_controller_1.getTestById);
app.put("/admin/diagnostic/edit/:id", admin_controller_1.updatedTestById);
app.delete("/admin/diagnostic/delete/:id", admin_controller_1.deleteTestBtId);
// doctors approval 
app.put('/doctor/:doctorId/approve', addAdmin_controller_1.approveDoctor);
const adminRouter = app;
exports.default = adminRouter;
