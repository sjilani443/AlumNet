import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Users, UserCheck, Mail, UserX } from "lucide-react";
import { getConnections, sendConnectionRequest, unsendConnectionRequest } from "../lib/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function NetworkView() {
  const [connections, setConnections] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch connections
      const connectionsRes = await getConnections();
      setConnections(connectionsRes.data);

      // Fetch all alumni
      const alumniRes = await axios.get(
        "http://localhost:5000/api/alumni",
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Filter out alumni that are already connected
      const filteredAlumni = alumniRes.data.filter(alum => 
        !connectionsRes.data.some(conn => conn.email === alum.email)
      );
      
      setAlumni(filteredAlumni);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionRequest = async (alumniEmail) => {
    try {
      await axios.post("http://localhost:5000/api/connections/request", {
        userEmail,
        alumniEmail,
      });

      toast.success("Connection request sent successfully!", {
        position: "top-center",
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Connection failed");
    }
  };

  const handleUnsendRequest = async (alumniEmail) => {
    try {
      await axios.delete("http://localhost:5000/api/connections/unsend", {
        data: { userEmail, alumniEmail },
      });

      toast.success("Connection request unsent!", {
        position: "top-center",
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error unsending request:", error);
      toast.error("Failed to unsend request");
    }
  };

  const handleMessage = (alumniEmail) => {
    navigate(`/student/messages?chat=${alumniEmail}`);
  };

  const filteredConnections = connections.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlumni = alumni.filter((alum) =>
    alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alum.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Network</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search alumni..."
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
        <>
          {/* Connections Section */}
          {filteredConnections.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Connections</h2>
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
                          <p className="text-sm text-gray-600">{user.department || "Alumni"}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {user.connections?.length || 0} mutual connections
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button 
                          onClick={() => handleMessage(user.email)}
                          className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center"
                        >
                          Message
                          <Mail className="h-4 w-4 ml-2" />
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Connected
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Alumni Section */}
          {filteredAlumni.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Available Alumni</h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAlumni.map((alum) => (
                  <motion.div
                    key={alum._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={alum.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                          alt={alum.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{alum.name}</h3>
                          <p className="text-sm text-gray-600">{alum.department || "Alumni"}</p>
                          <p className="text-sm text-gray-500">{alum.email}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {alum.connections?.length || 0} mutual connections
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button 
                          onClick={() => handleMessage(alum.email)}
                          className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center"
                        >
                          Message
                          <Mail className="h-4 w-4 ml-2" />
                        </button>
                        {alum.requests?.includes(userEmail) ? (
                          <button
                            onClick={() => handleUnsendRequest(alum.email)}
                            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Unsend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnectionRequest(alum.email)}
                            className="flex-1 px-4 py-2 border border-[#000000] text-[#000000] rounded-lg hover:bg-[#FDE7EB] transition-colors duration-200 flex items-center justify-center"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* No Results Message */}
          {filteredConnections.length === 0 && filteredAlumni.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No alumni found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
