import React, { useState, useEffect, useRef } from "react";
import { Send, Search, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function StudentMessagesView() {
  const [chats, setChats] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("name");
  const userAvatar = "https://cdn-icons-png.flaticon.com/512/4537/4537019.png";
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchChats();
    fetchAlumni();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatEmail = params.get('chat');
    if (chatEmail) {
      handleChatSelect(chatEmail);
    }
  }, [location.search]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/chats/${userEmail}`
      );
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
      setError("Failed to load chats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/alumni`);
      if (!response.ok) throw new Error("Failed to fetch alumni");
      const data = await response.json();
      setAlumni(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setAlumni([]);
    }
  };

  const fetchMessages = async (receiverEmail) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${userEmail}/${receiverEmail}`
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      setSelectedChat(receiverEmail);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (receiverEmail) => {
    fetchMessages(receiverEmail);
  };

  const sendMessageToBackend = async (message) => {
    const payload = {
      sender: userEmail,
      receiver: selectedChat,
      content: message.content,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      _id: Date.now(),
      sender: userEmail,
      content: messageInput,
      avatar: userAvatar,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await sendMessageToBackend(newMessage);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !sending) {
      handleSendMessage();
    }
  };

  // Filter alumni based on search query and merge with existing chats
  const filteredAlumni = alumni
    .filter(alum => alum.email !== userEmail)
    .filter(alum => 
      alum.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.currentRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Create a map to store unique users by email
  const uniqueUsersMap = new Map();

  // First add all existing chats
  chats.forEach(chat => {
    if (!uniqueUsersMap.has(chat.email)) {
      uniqueUsersMap.set(chat.email, {
        ...chat,
        isExistingChat: true
      });
    }
  });

  // Then add filtered alumni that aren't already in chats
  filteredAlumni.forEach(alum => {
    if (!uniqueUsersMap.has(alum.email)) {
      uniqueUsersMap.set(alum.email, {
        ...alum,
        isExistingChat: false
      });
    }
  });

  // Convert map to array and sort by last message time
  const mergedUsers = Array.from(uniqueUsersMap.values())
    .sort((a, b) => {
      // If both have lastMessageTime, sort by that
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }
      // If only one has lastMessageTime, put it first
      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;
      // If neither has lastMessageTime, sort by name
      return a.name.localeCompare(b.name);
    });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-12rem)] flex flex-col"
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 flex flex-col border-r border-gray-200 bg-gray-50"
        >
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              Messages
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mergedUsers.length > 0 ? (
              mergedUsers.map((user) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "#F3F4F6" }}
                  className={`p-4 cursor-pointer ${
                    selectedChat === user.email ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleChatSelect(user.email)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={user.avatar || user.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {user.currentRole} at {user.company}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.lastMessage || "Start a conversation"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <User className="w-8 h-8 mb-2" />
                <p>No alumni found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 flex flex-col bg-white"
        >
          {selectedChat ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === userEmail ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === userEmail
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Type a message..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Select an alumni to start messaging</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 