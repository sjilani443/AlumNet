import Conversation from "../models/Message.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    // Get all users except the current user
    const currentUserEmail = req.query.userEmail;
    
    const query = currentUserEmail ? { email: { $ne: currentUserEmail } } : {};
    
    const users = await User.find(query).select("name email avatar role").lean();

    const formattedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      avatar: user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s",
      role: user.role
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const participants = [sender, receiver].sort(); // Ensure consistent order

    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new Conversation({ participants, messages: [] });
    }

    // Add new message to the conversation
    conversation.messages.push({ sender, content });
    conversation.lastUpdated = Date.now();
    await conversation.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get messages between two users
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const participants = [sender, receiver].sort();

    const conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      return res.json({ messages: [] }); // No messages found
    }

    res.json(conversation.messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch all chats for a user (chat list)
export const getUserChats = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const conversations = await Conversation.find({
      participants: userEmail,
    })
      .sort({ lastUpdated: -1 })
      .lean();

    const emails = conversations.flatMap((c) => c.participants).filter((email) => email !== userEmail);
    const users = await User.find({ email: { $in: emails } }).lean();

    const userMap = users.reduce((acc, user) => {
      acc[user.email] = {
        name: user.name,
        avatar: user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s",
      };
      return acc;
    }, {});

    const chatList = conversations.map((chat) => ({
      email: chat.participants.find((p) => p !== userEmail),
      name: userMap[chat.participants.find((p) => p !== userEmail)]?.name || "Unknown",
      avatar: userMap[chat.participants.find((p) => p !== userEmail)]?.avatar,
      lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : "",
      lastMessageTime: chat.lastUpdated.toLocaleTimeString(),
    }));

    res.json(chatList);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

