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
exports.getMessageHistory = exports.sendMessage = exports.createChatSession = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
// Create a new chat session
const createChatSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, doctorId } = req.body;
        const existingSession = yield prisma_1.default.chatSessions.findFirst({
            where: { AND: [{ user_id: userId }, { doctor_id: doctorId }] },
        });
        if (existingSession) {
            return res.status(200).json({ sessionId: existingSession.session_id });
        }
        // Create a new chat session
        const newSession = yield prisma_1.default.chatSessions.create({
            data: {
                user_id: userId,
                doctor_id: doctorId,
            },
        });
        return res.status(201).json({ sessionId: newSession.session_id });
    }
    catch (error) {
        console.error("Error creating chat session:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createChatSession = createChatSession;
// Send a message in a chat session
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, senderId, recipientId, message } = req.body;
        // Save the message to the database
        const newMessage = yield prisma_1.default.chatMessages.create({
            data: {
                session_id: sessionId,
                sender_id: senderId,
                recipient_id: recipientId,
                message: message,
            },
        });
        return res.status(201).json({ messageId: newMessage.message_id });
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
// Fetch message history for a chat session
const getMessageHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.params.sessionId;
        // Fetch all messages for the given session ID
        const messages = yield prisma_1.default.chatMessages.findMany({
            where: { session_id: sessionId },
            orderBy: { timestamp: "asc" },
        });
        return res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching message history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMessageHistory = getMessageHistory;
