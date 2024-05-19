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
exports.deleteTestBtId = exports.updatedTestById = exports.getTestById = exports.getAllDiagnosticTest = exports.createDiagnosticTest = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const status_1 = require("../../../enums/status");
// create test
const createDiagnosticTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tests } = req.body;
        const createdTests = yield Promise.all(tests.map((test) => __awaiter(void 0, void 0, void 0, function* () {
            const { name, price, type } = test;
            if (type !== "regular" && type !== "premium") {
                return res.status(status_1.StatusCode.BadRequest).json({
                    message: "Invalid test type. Test type must be 'regular' or 'premium'.",
                });
            }
            // Create the diagnostic test
            const diagnosticTest = yield prisma_1.default.diagnosticTest.create({
                data: {
                    name,
                    price,
                    type,
                },
            });
            return diagnosticTest;
        })));
        res.status(status_1.StatusCode.Created).json({ tests: createdTests });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error creating diagnostic test", error });
    }
});
exports.createDiagnosticTest = createDiagnosticTest;
// retrieve all diagnostic tests
const getAllDiagnosticTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diagnosticTests = yield prisma_1.default.diagnosticTest.findMany();
        res.status(status_1.StatusCode.OK).json({ diagnosticTests });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error retrieving the diagnostic tests", error });
    }
});
exports.getAllDiagnosticTest = getAllDiagnosticTest;
// retrieve a test by Id
const getTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const diagnosticTest = yield prisma_1.default.diagnosticTest.findUnique({
            where: { id },
        });
        if (!diagnosticTest) {
            return res
                .status(status_1.StatusCode.NotFound)
                .json({ message: "Diagnostic test not found" });
        }
        res.status(status_1.StatusCode.OK).json({ diagnosticTest });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error retrieving diagnostic test", error });
    }
});
exports.getTestById = getTestById;
// update a test by Id
const updatedTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, type } = req.body;
        const updateTest = yield prisma_1.default.diagnosticTest.update({
            where: { id },
            data: { name, price, type },
        });
        res.status(status_1.StatusCode.OK).json({ updateTest });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "failed to update test", error });
    }
});
exports.updatedTestById = updatedTestById;
// delete test by id
const deleteTestBtId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.diagnosticTest.delete({ where: { id } });
        res.status(status_1.StatusCode.OK).json({ message: "diagnostic test deleted" });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error deleting test", error });
    }
});
exports.deleteTestBtId = deleteTestBtId;
