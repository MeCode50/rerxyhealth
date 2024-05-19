"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_number_schema = exports.update_password_schema = void 0;
const Yup = __importStar(require("yup"));
const update_password_schema = Yup.object().shape({
    current_password: Yup.string().required(),
    new_password: Yup.string().required(),
    confirm_new_password: Yup.string()
        //@ts-ignore
        .oneOf([Yup.ref("new_password"), null], "Password must match")
        .required(),
});
exports.update_password_schema = update_password_schema;
const update_number_schema = Yup.object().shape({
    new_number: Yup.string().required(" New number is required"),
    old_number: Yup.string().required(" Current number is required"),
});
exports.update_number_schema = update_number_schema;
