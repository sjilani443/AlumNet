import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Search, Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); // Get from localStorage initially
  const [loading, setLoading] = useState(!userName);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New connection request', message: 'Sarah Johnson wants to connect with you', time: '5 min ago' },
    { id: 2, title: 'Event Reminder', message: 'Tech Talk starts in 1 hour', time: '1 hour ago' },
  ];

  // Fetch user's name from the backend API
  const fetchUserName = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!email) {
      setError('Email not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/profile/name?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUserName(data.name);
      localStorage.setItem('userName', data.name); // Save username in localStorage for instant updates
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userName) {
      fetchUserName();
    }
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-primary-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left Section */}
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-all duration-200 mr-4">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="https://srmap.edu.in/file/2018/03/SRMAP-Logo.png" alt="SRM AP Logo" className="h-12 w-auto" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-primary-500 tracking-tight">AlumNet</h1>
                <span className="text-xs text-primary-400 tracking-wide">SRM University AP</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-xl bg-primary-50 border border-primary-200 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
              />
              <Search className="h-5 w-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-primary-500 hover:text-accent-yellow transition-all duration-200 hover:scale-110 relative"
                onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent-red rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-primary-100">
                    <h3 className="font-semibold text-primary-500">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-primary-50 cursor-pointer">
                        <h4 className="text-sm font-medium text-primary-500">{notification.title}</h4>
                        <p className="text-sm text-primary-400">{notification.message}</p>
                        <span className="text-xs text-primary-300">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <button className="p-2 text-primary-500 hover:text-accent-yellow transition-all duration-200 hover:scale-110"
              onClick={() => navigate('/messages')}>
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* Profile Section */}
            <button onClick={() => navigate('/profile')} className="flex items-center space-x-2 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors duration-200">
              <img src="https://cdn-icons-png.flaticon.com/512/4537/4537019.png"
                alt="Profile" className="w-8 h-8 rounded-full" />
              {loading ? (
                <span className="text-sm font-medium text-primary-500">Loading...</span>
              ) : error ? (
                <span className="text-sm font-medium text-primary-500">Error</span>
              ) : (
                <span className="text-sm font-medium text-primary-500">{userName || 'Guest'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
