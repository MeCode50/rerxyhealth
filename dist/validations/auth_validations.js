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
exports.validate_login = exports.createUserValidation = void 0;
const Yup = __importStar(require("yup"));
// Create user Yup input validation
const createUserValidation = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    dateOfBirth: Yup.date().required(),
    country: Yup.string().required(),
    phoneNumber: Yup.string().required(),
    schoolName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(12).required(),
    address: Yup.object().shape({
        state: Yup.string().required("State is required"),
        local_government: Yup.string().required("Local government is required"),
        city: Yup.string().required("City is required"),
        street: Yup.string().required("Street is required"),
    }),
});
exports.createUserValidation = createUserValidation;
const validate_login = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required(),
});
exports.validate_login = validate_login;
