"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWorkingHours = exports.signinDoctor = exports.signupDoctor = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../prisma"));
const jwt_helper_1 = require("../../helper/jwt_helper");
const mailer_1 = require("../../services/nodemailer/mailer");
const status_1 = require("../../enums/status");
// Signup for doctors
const signupDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber, specialization, country, state, certificate, profilePicture, yearsOfExperience, graduationYear, school, medicalLicensePicture, about, } = req.body;
    // Log the entire request body to debug
    console.log("Request body:", req.body);
    try {
        // Check if all required fields are provided
        if (!email ||
            !password ||
            !firstName ||
            !lastName ||
            !phoneNumber ||
            !specialization ||
            !country ||
            !state ||
            !certificate ||
            !yearsOfExperience ||
            !graduationYear ||
            !school ||
            !medicalLicensePicture) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingDoctor = yield prisma_1.default.doctors.findUnique({
            where: { email },
        });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newDoctor = yield prisma_1.default.doctors.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                specialization,
                country,
                state,
                certificate,
                profilePicture,
                yearsOfExperience,
                graduationYear,
                school,
                medicalLicensePicture,
                about,
                isApproved: false,
            },
        });
        const { id } = newDoctor;
        const jwt = (0, jwt_helper_1.signJWT)({ id });
        const emailDetails = {
            subject: "Welcome to RexHealth 🔥",
            body: { username: firstName },
            template: "email_templates/welcome",
        };
        yield (0, mailer_1.sendMail)(Object.assign({ email }, emailDetails));
        res.status(201).json({
            message: "Doctor registered successfully",
            jwt,
            doctor: newDoctor,
        });
    }
    catch (error) {
        console.error("Error signing up doctor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signupDoctor = signupDoctor;
// Signin doctors
const signinDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const doctor = yield prisma_1.default.doctors.findUnique({
            where: { email },
        });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (!doctor.isApproved) {
            return res.status(401).json({
                message: "Account not yet approved. Please wait for admin approval",
            });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, doctor.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const jwt = (0, jwt_helper_1.signJWT)({ id: doctor.id });
        res.status(200).json({ message: "Signin successful", jwt });
    }
    catch (error) {
        console.error("Error signing in doctor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signinDoctor = signinDoctor;
const setWorkingHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, workingHours } = req.body;
    try {
        yield prisma_1.default.workingHours.deleteMany({
            where: { doctorId },
        });
        const newWorkingHours = yield prisma_1.default.workingHours.createMany({
            data: workingHours.map((hour) => (Object.assign(Object.assign({}, hour), { doctorId }))),
        });
        res.status(status_1.StatusCode.OK).json({
            message: "Working hours set successfully",
            data: newWorkingHours,
        });
    }
    catch (error) {
        console.error("Error setting working hours:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.setWorkingHours = setWorkingHours;
