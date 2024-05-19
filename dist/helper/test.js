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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transEndpoint = void 0;
const verify_transaction_1 = require("./verify_transaction");
const transEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reference = req.params.id;
        const transactionDetails = yield (0, verify_transaction_1.verifyTransaction)(reference);
        res.status(200).json(transactionDetails);
    }
    catch (error) {
        console.error("error verifying", error);
        res.status(500).json({ error: "an error occoured while verifying" });
    }
});
exports.transEndpoint = transEndpoint;
