import express from "express";
import {
  sendMessage,
  getMessagesBetweenUsers,
  getUserChats,
  getAllUsers
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users",getAllUsers);
router.post("/send", sendMessage); // ✅ Send a message
router.get("/:sender/:receiver", getMessagesBetweenUsers); // ✅ Get messages between users
router.get("/chats/:userEmail", getUserChats); // ✅ Get user chat list

export default router;
