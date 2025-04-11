// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentHome from './pages/StudentHome';
import AlumniHome from './pages/AlumniHome';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = localStorage.getItem('role'); // 'student' or 'alumni'

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Role-based Protected Routing */}
        <Route
          path="/student/*"
          element={
            isAuthenticated && role === 'student' ? (
              <StudentHome />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/alumni/*"
          element={
            isAuthenticated && role === 'alumni' ? (
              <AlumniHome />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Optional: Root redirection based on role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'alumni' ? (
                <Navigate to="/alumni" />
              ) : (
                <Navigate to="/student" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all route fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
