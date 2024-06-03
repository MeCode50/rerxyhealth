import { Request, Response } from "express";
import prisma from "../../prisma";

// Create a new chat session
const createChatSession = async (req: Request, res: Response) => {
try {
const { userId, doctorId } = req.body;

const existingSession = await prisma.chatSessions.findFirst({
where: {AND: [{ user_id: userId }, { doctor_id: doctorId }]},
    });

if (existingSession) {return res.status(200).json({ sessionId: existingSession.session_id });
    }

    // Create a new chat session
    const newSession = await prisma.chatSessions.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
      },
    });

    return res.status(201).json({ sessionId: newSession.session_id });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message in a chat session
const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, senderId, recipientId, message } = req.body;

    // Save the message to the database
    const newMessage = await prisma.chatMessages.create({
      data: {
        session_id: sessionId,
        sender_id: senderId,
        recipient_id: recipientId,
        message: message,
      },
    });

    return res.status(201).json({ messageId: newMessage.message_id });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch message history for a chat session
const getMessageHistory = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;

    // Fetch all messages for the given session ID
    const messages = await prisma.chatMessages.findMany({
      where: { session_id: sessionId },
      orderBy: { timestamp: "asc" },
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching message history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createChatSession, sendMessage, getMessageHistory };
