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
const prisma_1 = __importDefault(require("../../../prisma"));
const auth_validations_1 = require("../../../validations/auth_validations");
const status_1 = require("../../../enums/status");
const generate_otp_1 = require("../../../helper/generate_otp");
const jwt_helper_1 = require("../../../helper/jwt_helper");
const bcrypt = require("bcrypt");
const adminCreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, dateOfBirth, country, phoneNumber, schoolName, email, password, } = req.body;
        yield auth_validations_1.createUserValidation.validate({
            firstName,
            lastName,
            dateOfBirth,
            country,
            phoneNumber,
            schoolName,
            email,
            password,
        });
        const createOtp = (0, generate_otp_1.generateOtp)();
        const hashPassword = yield bcrypt.hash(password, 10);
        //check if user already exists
        const userExisted = yield prisma_1.default.users.findUnique({
            where: { email },
        });
        if (userExisted) {
            res.status(status_1.StatusCode.Found).json({
                message: "User already exists",
            });
        }
        const newUser = yield prisma_1.default.users.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                country: country,
                phoneNumber: phoneNumber,
                schoolName: schoolName,
                email: email,
                password: hashPassword,
                otp: parseInt(createOtp),
            },
        });
        const { id } = newUser;
        const jwt = (0, jwt_helper_1.signJWT)({
            id: id,
        });
        return res.status(status_1.StatusCode.Created).json({
            message: "user created successfully",
            jwt: jwt,
            user: newUser,
            otp: createOtp,
        });
    }
    catch (err) {
        return (res
            .status(status_1.StatusCode.InternalServerError)
            //@ts-ignore
            .json({ message: err === null || err === void 0 ? void 0 : err.message }));
    }
});
