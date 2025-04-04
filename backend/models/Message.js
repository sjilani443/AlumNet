import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // Messages don't need a separate ID
);

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // Array of emails [user1, user2]
  messages: [messageSchema], // Array of messages
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", conversationSchema);
