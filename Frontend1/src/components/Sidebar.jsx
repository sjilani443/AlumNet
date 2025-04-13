import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Calendar,
  Users,
  MessageSquare,
  LogOut,
  ChevronLeft,
  UserCircle,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: '', branch: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('role'); // 'student' or 'alumni'
  const basePath = role === 'alumni' ? '/alumni' : '/student';

  const menuItems = [
    { icon: Home, label: 'Home', path: `${basePath}` },
    { icon: Briefcase, label: 'Referrals', path: `${basePath}/jobs` },
    { icon: Calendar, label: 'Events', path: `${basePath}/events` },
    { icon: MessageSquare, label: 'Messages', path: `${basePath}/messages` },
    { icon: Users, label: 'Network', path: `${basePath}/network` },
    { icon: UserCircle, label: 'Profile', path: `${basePath}/profile` },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        setError('Token or email not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/profile/nameand?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUser({ name: data?.name || 'No Name', branch: data?.department || 'No Branch' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'student') {
      fetchUserData();
    } else {
      setUser({ name: localStorage.getItem('userName') || 'No Name' }); // For alumni, get name from localStorage
      setLoading(false);
    }
  }, [role]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary-500/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="p-6 border-b border-primary-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-500">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-all duration-200"
            aria-label="Close Sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </header>

        <section className="p-6 flex items-center space-x-4">
          <div className="relative group">
            <img
              src={role === 'alumni' ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s" : "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
              alt="User profile"
              className="w-14 h-14 rounded-full ring-2 ring-primary-100 group-hover:ring-accent-yellow transition-all duration-200 cursor-pointer"
              onClick={() => handleNavigation(`${basePath}/profile`)}
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent-yellow rounded-full ring-2 ring-white"></span>
          </div>
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <>
                <h3 className="font-semibold text-primary-500">{user?.name}</h3>
                {role === 'student' && <p className="text-sm text-primary-400">{user?.branch}</p>}
                {role === 'alumni' && <p className="text-sm text-primary-400">Alumni</p>}
              </>
            )}
          </div>
        </section>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === path
                  ? 'bg-primary-50 text-primary-500'
                  : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500'
              }`}
              aria-label={label}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>

        <footer className="p-4 border-t border-primary-100">
          <button
            className="flex items-center w-full px-4 py-3 text-accent-red rounded-lg hover:bg-accent-red/10 transition-all duration-200"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
