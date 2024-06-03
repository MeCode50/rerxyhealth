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
exports.sendMail = void 0;
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const handlebarsExpress = require("nodemailer-express-handlebars");
(0, dotenv_1.config)(); // Load environment variables
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, subject, template, body }) {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path_1.default.resolve("./views/"),
            defaultLayout: false,
        },
        viewPath: path_1.default.resolve("./views/"),
    };
    transporter.use("compile", handlebarsExpress(handlebarOptions));
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        template: template,
        subject: subject,
        context: body,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(error);
            }
            else {
                console.log(`Email sent: ${info.response}`);
                resolve(info.response);
            }
        });
    });
});
exports.sendMail = sendMail;
