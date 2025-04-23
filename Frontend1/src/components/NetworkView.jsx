import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, UserPlus, UserCheck, UserX, Mail, Users } from "lucide-react";
import { getConnections, sendConnectionRequest, unsendConnectionRequest } from "../lib/api";

export default function NetworkView() {
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await getConnections();
      setConnections(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch connections");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionRequest = async (userId) => {
    try {
      await sendConnectionRequest(userId);
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsendRequest = async (userId) => {
    try {
      await unsendConnectionRequest(userId);
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConnections = connections.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Network</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredConnections.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.department || "Student"}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {user.connections?.length || 0} mutual connections
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center">
                    Message
                    <Mail className="h-4 w-4 ml-2" />
                  </button>
                  <button
                    onClick={() => handleConnectionRequest(user._id)}
                    className="flex-1 px-4 py-2 border border-[#000000] text-[#000000] rounded-lg hover:bg-[#FDE7EB] transition-colors duration-200 flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
