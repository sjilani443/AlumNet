// src/pages/AlumniHome.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/useAuthStore';
import HomePage from './HomePage';
import EventsPage from './EventsPage';
import MessagesPage from './MessagesPage';
import NetworkPage from './NetworkPage';
import ProfilePage from './ProfilePage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function AlumniHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && (
            <>
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            </>
          )}
          <div>Hello</div>

          <Routes>
            {/* <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </div>
    </QueryClientProvider>
  );
}
