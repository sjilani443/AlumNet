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

        {/* Protected Route: Student */}
        <Route
          path="/student/*"
          element={
            isAuthenticated && role === 'student' ? (
              <StudentHome />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Route: Alumni */}
        <Route
          path="/alumni/*"
          element={
            isAuthenticated && role === 'alumni' ? (
              <AlumniHome />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Root Redirect: Based on Role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'alumni' ? (
                <Navigate to="/alumni" replace />
              ) : (
                <Navigate to="/student" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
