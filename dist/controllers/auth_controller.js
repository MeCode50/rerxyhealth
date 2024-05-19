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
exports.createUserController = exports.verifyOtp = exports.loginController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const status_1 = require("../enums/status");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_validations_1 = require("../validations/auth_validations");
const jwt_helper_1 = require("../helper/jwt_helper");
const generate_otp_1 = require("../helper/generate_otp");
const mailer_1 = require("../services/nodemailer/mailer");
// Creating new user
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, dateOfBirth, country, phoneNumber, schoolName, email, password, state, local_government, city, street, } = req.body;
        yield auth_validations_1.createUserValidation.validate({
            firstName,
            lastName,
            dateOfBirth,
            country,
            phoneNumber,
            schoolName,
            email,
            password,
            address: {
                street,
                state,
                local_government,
                city,
            }
        });
        const userExists = yield prisma_1.default.users.findUnique({
            where: { email },
        });
        if (userExists) {
            return res.status(status_1.StatusCode.Found).json({
                message: 'User already exists',
            });
        }
        const createOtp = (0, generate_otp_1.generateOtp)();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma_1.default.users.create({
            data: {
                firstName,
                lastName,
                dateOfBirth,
                country,
                phoneNumber,
                schoolName,
                email: email.toLowerCase(),
                password: hashedPassword,
                otp: parseInt(createOtp),
                address: {
                    create: {
                        state,
                        local_government,
                        street,
                        city,
                    }
                }
            },
            include: {
                address: true
            }
        });
        const { id } = newUser;
        const jwt = (0, jwt_helper_1.signJWT)({ id });
        const emailDetails = {
            subject: 'Welcome to RexHealth 🔥',
            body: { username: firstName, otp: createOtp },
            template: 'email_templates/welcome',
        };
        yield (0, mailer_1.sendMail)(Object.assign({ email }, emailDetails));
        const userDetails = {
            email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
            firstName: newUser === null || newUser === void 0 ? void 0 : newUser.email,
            lastName: newUser === null || newUser === void 0 ? void 0 : newUser.lastName,
            dateOfBirth: newUser === null || newUser === void 0 ? void 0 : newUser.dateOfBirth,
            country: newUser === null || newUser === void 0 ? void 0 : newUser.country,
            phoneNumber: newUser === null || newUser === void 0 ? void 0 : newUser.phoneNumber,
            schoolName: newUser === null || newUser === void 0 ? void 0 : newUser.schoolName,
            address: newUser === null || newUser === void 0 ? void 0 : newUser.address,
        };
        return res.status(status_1.StatusCode.Created).json({
            message: 'User created successfully',
            jwt,
            details: userDetails,
            otp: createOtp,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_1.StatusCode.InternalServerError).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.createUserController = createUserController;
//login user controller
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = yield auth_validations_1.validate_login.validate(req.body);
        const user = yield prisma_1.default.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(status_1.StatusCode.NotFound).json({
                message: 'User not found',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isPasswordValid) {
            return res.status(status_1.StatusCode.BadRequest).json({
                message: 'Incorrect Password',
            });
        }
        const jwt = (0, jwt_helper_1.signJWT)({
            id: user === null || user === void 0 ? void 0 : user.id,
        });
        if (!user.verified) {
            const otp = +(0, generate_otp_1.generateOtp)();
            const updatedUser = yield prisma_1.default.users.update({
                where: { email },
                data: { otp },
            });
            if (!updatedUser) {
                return res.status(status_1.StatusCode.InternalServerError).json({
                    message: 'Something went wrong',
                });
            }
            return res.status(status_1.StatusCode.Forbidden).json({
                message: `The email ${user.email} is not verified, please verify email`,
                otp,
            });
        }
        return res.status(status_1.StatusCode.OK).json({
            message: 'Login successful',
            jwt,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_1.StatusCode.BadRequest).json({
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.loginController = loginController;
//verify otp
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(status_1.StatusCode.BadRequest).json({
                message: 'Email is required for OTP verification',
            });
        }
        const user = yield prisma_1.default.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(status_1.StatusCode.NotFound).json({
                message: 'Email does not exist',
            });
        }
        const { otp: userOtp } = user;
        const isOtpValid = +otp === userOtp;
        if (!isOtpValid) {
            return res.status(status_1.StatusCode.BadRequest).json({
                message: 'Invalid OTP',
            });
        }
        // Verify email
        yield prisma_1.default.users.update({
            where: { email },
            data: {
                verified: true,
            },
        });
        return res.status(status_1.StatusCode.OK).json({
            message: 'Email verified successfully',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_1.StatusCode.InternalServerError).json({
            error: error === null || error === void 0 ? void 0 : error.message,
            body: req === null || req === void 0 ? void 0 : req.body,
            message: 'An error occurred during OTP verification',
        });
    }
});
exports.verifyOtp = verifyOtp;
