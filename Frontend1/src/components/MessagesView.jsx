import React, { useState, useEffect, useRef } from "react";
import { Send, Search } from "lucide-react";

export default function MessagesView() {
  const [chats, setChats] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("name");
  const userAvatar = localStorage.getItem("avatar"); // Keep this for user but use profileImage for alumni
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
    fetchAlumni();
  }, []);

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

      const uniqueChats = Array.from(
        new Map(data.map((item) => [item.email, item])).values()
      );
      setChats(uniqueChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/alumni`);
      if (!response.ok) throw new Error("Failed to fetch alumni");
      const data = await response.json();
      setAlumni(data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
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

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return; // Prevent sending empty messages
  
    // ✅ Create new message object
    const newMessage = {
      _id: Date.now(), // Temporary unique ID
      sender: userEmail, // Assuming userEmail is the logged-in user
      content: messageInput,
      avatar: "https://via.placeholder.com/40", // Replace with user's actual avatar
    };
  
    // ✅ Update UI immediately before sending to backend
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    try {
      // ✅ Send message to backend
      await sendMessageToBackend(newMessage);
  
      // ✅ Scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  
    // ✅ Clear input field
    setMessageInput("");
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !sending) {
      handleSendMessage();
    }
  };

  const mergedAlumni = [
    ...chats.filter((chat) => alumni.some((alum) => alum.email === chat.email)),
    ...alumni.filter(
      (alum) => !chats.some((chat) => chat.email === alum.email)
    ),
  ]
    .filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-12rem)]">
  <div className="flex h-full">
    {/* ✅ Chat List */}
    <div className="w-80 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-5rem)]">
        {loading ? (
          <p className="text-gray-500 text-center p-4">Loading...</p>
        ) : mergedAlumni.length > 0 ? (
          mergedAlumni.map((user) => (
            <div
              key={user.email}
              onClick={() => fetchMessages(user.email)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat === user.email ? "bg-primary-50" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.profileImage} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {user.lastMessage || "Start a conversation"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center p-4">No alumni found</p>
        )}
      </div>
    </div>

    {/* ✅ Chat Window */}
    <div className="flex-1 flex flex-col h-full">
      {selectedChat ? (
        <>
          {/* ✅ Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              {mergedAlumni.find((c) => c.email === selectedChat)?.name}
            </h3>
          </div>

          {/* ✅ Messages List */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex items-start space-x-3 ${
                  message.sender === userEmail ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== userEmail && (
                  <img
                    src={message.avatar}
                    className="w-8 h-8 rounded-full"
                    alt="Avatar"
                  />
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === userEmail
                      ? "bg-gray-500 text-white self-end" // ✅ Changed to gray
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ✅ Message Input */}
          <div className="p-4 border-t flex space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 p-2 border rounded-lg"
            />
            <button onClick={handleSendMessage} className="p-2 bg-gray-500 text-white rounded-lg">
              <Send />
            </button>
          </div>
        </>
      ) : (
        // ✅ Centered "Select a chat" Message
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Select a chat</p>
        </div>
      )}
    </div>
  </div>
</div>


  );
}
