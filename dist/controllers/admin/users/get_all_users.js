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
exports.getAllUsers = void 0;
const status_1 = require("../../../enums/status");
const prisma_1 = __importDefault(require("../../../prisma"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchUsers = yield prisma_1.default.users.findMany();
        if (!fetchUsers)
            return res
                .status(status_1.StatusCode.InternalServerError)
                .json({ message: "An error occurred" });
        return res
            .status(status_1.StatusCode.OK)
            .json({ message: "Users fetched successfully", data: fetchUsers });
    }
    catch (err) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "An error occurred" });
    }
});
exports.getAllUsers = getAllUsers;
