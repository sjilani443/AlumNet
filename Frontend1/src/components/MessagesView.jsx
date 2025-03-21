import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';

export default function MessagesView() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for the help!',
      timestamp: '5 min ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop',
      unread: 2
    },
    {
      id: 2,
      name: 'Michael Chen',
      lastMessage: 'When can we meet?',
      timestamp: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop',
      unread: 0
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi! I saw you\'re working at Google. I\'d love to learn more about your experience.',
      timestamp: '10:30 AM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Of course! Happy to help. What would you like to know?',
      timestamp: '10:32 AM',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&fit=crop'
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Thanks for the help!',
      timestamp: '10:33 AM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop'
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={chats.find(c => c.id === selectedChat)?.avatar}
                    alt="Chat"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {chats.find(c => c.id === selectedChat)?.name}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-8 h-8 rounded-full"
                    />
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'You'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.sender === 'You' ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
