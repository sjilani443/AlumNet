import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Menu } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [loading, setLoading] = useState(!userName);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const role = localStorage.getItem('role'); // 'student' or 'alumni'
  const basePath = role === 'alumni' ? '/alumni' : '/student';

  // Profile images based on role
  const profileImages = {
    student: "https://cdn-icons-png.flaticon.com/512/4537/4537019.png",
    alumni: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s"
  };

  const notifications = [
    { id: 1, title: 'New connection request', message: 'Sarah Johnson wants to connect with you', time: '5 min ago' },
    { id: 2, title: 'Event Reminder', message: 'Tech Talk starts in 1 hour', time: '1 hour ago' },
  ];

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
      localStorage.setItem('userName', data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userName) {
      fetchUserName();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            <div className="flex items-center gap-3 cursor-pointer ml-5" onClick={() => navigate(`${basePath}`)}>
              <img src="https://srmap.edu.in/file/2018/03/SRMAP-Logo.png" alt="SRM AP Logo" className="h-12 w-auto" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-primary-500 tracking-tight">AlumNet</h1>
                <span className="text-xs text-primary-400 tracking-wide">SRM University AP</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                className="p-2 text-primary-500 hover:text-accent-yellow transition-all duration-200 hover:scale-110 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
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
            <button
              className="p-2 text-primary-500 hover:text-accent-yellow transition-all duration-200 hover:scale-110"
              onClick={() => navigate(`${basePath}/messages`)}
            >
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate(`${basePath}/profile`)}
              className="flex items-center space-x-2 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors duration-200 group"
            >
              <div className="relative">
                <img
                  src={profileImages[role] || profileImages.student}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all duration-200"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex flex-col items-start">
                {loading ? (
                  <span className="text-sm font-medium text-primary-500">Loading...</span>
                ) : error ? (
                  <span className="text-sm font-medium text-primary-500">Error</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-primary-500">{userName || 'Guest'}</span>
                    <span className="text-xs text-primary-400 capitalize">{role || 'user'}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
