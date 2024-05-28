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
exports.createDiagnosticTest = exports.removeSelectedTest = exports.addSelectedTest = exports.handleDiagnosticTests = void 0;
const status_1 = require("../../enums/status");
const prisma_1 = __importDefault(require("../../prisma"));
const handleDiagnosticTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve regular tests
        const regularTests = yield prisma_1.default.diagnosticTest.findMany({
            where: { type: "regular" },
            select: { id: true, name: true, price: true },
        });
        // Retrieve premium tests
        const premiumTests = yield prisma_1.default.diagnosticTest.findMany({
            where: { type: "premium" },
            select: { id: true, name: true, price: true },
        });
        // Return list of regular and premium tests with their details
        res.status(status_1.StatusCode.OK).json({
            regularTests,
            premiumTests,
        });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error retrieving diagnostic tests", error });
    }
});
exports.handleDiagnosticTests = handleDiagnosticTests;
const createDiagnosticTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tests } = req.body;
        const createdTests = yield Promise.all(tests.map((test) => __awaiter(void 0, void 0, void 0, function* () {
            const { name, price, type } = test;
            // Check if the provided test type is valid
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
const addSelectedTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, diagnosticTestIds, quantity } = req.body;
        let idsToProcess;
        // to check if diagnostic test is an array 
        if (Array.isArray(diagnosticTestIds)) {
            idsToProcess = diagnosticTestIds;
        }
        else if (typeof diagnosticTestIds === "string") {
            idsToProcess = [diagnosticTestIds];
        }
        else {
            return res.status(status_1.StatusCode.BadRequest).json({
                message: "Invalid diagnostic test format, expected an array "
            });
        }
        const user = yield prisma_1.default.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res
                .status(status_1.StatusCode.NotFound)
                .json({ message: "User not found" });
        }
        // Iterate over each selected diagnostic test ID
        for (const diagnosticTestId of diagnosticTestIds) {
            // Check if the diagnostic test exists
            const diagnosticTest = yield prisma_1.default.diagnosticTest.findUnique({
                where: { id: diagnosticTestId },
            });
            if (!diagnosticTest) {
                return res.status(status_1.StatusCode.NotFound).json({
                    message: `Diagnostic test with ID ${diagnosticTestId} not found`,
                });
            }
            // Add the selected test to the database
            const selectedTest = yield prisma_1.default.selectedTest.create({
                data: {
                    userId: userId,
                    testName: diagnosticTest.name,
                    price: diagnosticTest.price,
                    quantity: quantity,
                    diagnosticTestId: diagnosticTestId,
                },
            });
        }
        res
            .status(status_1.StatusCode.Created)
            .json({ message: "Selected tests added successfully" });
    }
    catch (error) {
        console.error("Error adding selected tests:", error);
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error adding selected tests", error });
    }
});
exports.addSelectedTest = addSelectedTest;
const removeSelectedTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectedTestId = req.params.id;
        // Delete the selected test from the user's cart
        yield prisma_1.default.selectedTest.delete({
            where: { id: selectedTestId },
        });
        res.status(status_1.StatusCode.OK).json({ message: "Selected test deleted" });
    }
    catch (error) {
        res
            .status(status_1.StatusCode.InternalServerError)
            .json({ message: "Error removing selected test", error });
    }
});
exports.removeSelectedTest = removeSelectedTest;
