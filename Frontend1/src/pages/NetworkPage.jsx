import React from "react";
import Network from "../components/NetworkView";
import AlumniNetwork from "../components/AlumniNetwork";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NetworkPage() {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  // If no role is set, redirect to home
  if (!userRole) {
    navigate('/');
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
        >
          {userRole === 'alumni' ? (
            <AlumniNetwork />
          ) : userRole === 'student' ? (
            <Network />
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}