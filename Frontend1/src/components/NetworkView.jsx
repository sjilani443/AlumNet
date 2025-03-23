import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, UserPlus, Mail, XCircle } from "lucide-react";

export default function NetworkView() {
  const [connections, setConnections] = useState([]); // Connected alumni
  const [recommendations, setRecommendations] = useState([]); // Unconnected alumni
  const userEmail = localStorage.getItem("email") || "";

  // ✅ Fetch all alumni (connections & requests)
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/alumni`);
      const allAlumni = response.data;

      // ✅ Separate connected and unconnected alumni
      const connectedAlumni = [];
      const unconnectedAlumni = [];

      allAlumni.forEach((alumni) => {
        if (alumni.connections?.some((conn) => conn.email === userEmail)) {
          connectedAlumni.push(alumni);
        } else if (alumni.email !== userEmail) {
          unconnectedAlumni.push({
            ...alumni,
            isRequested: alumni.requests?.includes(userEmail), // ✅ Check requests directly
          });
        }
      });

      setConnections(connectedAlumni);
      setRecommendations(unconnectedAlumni);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  // ✅ Handle Connection Request
  const handleConnect = async (alumniEmail) => {
    try {
      await axios.post("http://localhost:5000/api/connections/request", {
        userEmail,
        alumniEmail,
      });

      toast.success("Connection request sent!", { position: "top-center" });

      // ✅ Optimistically update state
      setRecommendations((prev) =>
        prev.map((alumni) =>
          alumni.email === alumniEmail ? { ...alumni, isRequested: true } : alumni
        )
      );
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send request");
    }
  };

  // ✅ Handle Unsend Request
  const handleUnsendRequest = async (alumniEmail) => {
    try {
      await axios.delete("http://localhost:5000/api/connections/unsend", {
        data: { userEmail, alumniEmail }, // ✅ Send request data in body
      });

      toast.success("Connection request unsent!", { position: "top-center" });

      // ✅ Optimistically update state
      setRecommendations((prev) =>
        prev.map((alumni) =>
          alumni.email === alumniEmail ? { ...alumni, isRequested: false } : alumni
        )
      );
    } catch (error) {
      console.error("Error unsending request:", error);
      toast.error("Failed to unsend request");
    }
  };

  // ✅ Handle Ignore Action
  const handleIgnore = (alumniEmail) => {
    setRecommendations((prev) => prev.filter((alumni) => alumni.email !== alumniEmail));
  };

  return (
    <div className="space-y-8">
      {/* ✅ Your Network Section */}
      <div>
        {connections.length === 0 ? (
          <p className="text-gray-500">You haven't connected with any alumni yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={connection.profileImage || "https://via.placeholder.com/100"}
                      alt={connection.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-600">{connection.currentRole}</p>
                      <p className="text-sm text-gray-500">{connection.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {connection.connections.length} mutual connections
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 flex items-center justify-center">
                      Message
                      <Mail className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Recommended Connections Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Connections</h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-500">No new alumni to connect with.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((alumni) => (
              <div
                key={alumni._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={alumni.profileImage || "https://via.placeholder.com/100"}
                      alt={alumni.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{alumni.name}</h3>
                      <p className="text-sm text-gray-600">{alumni.currentRole}</p>
                      <p className="text-sm text-gray-500">{alumni.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {alumni.mutualConnections} mutual connections
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      className="flex-1 px-4 py-2 border border-[#000000] text-[#000000] rounded-lg hover:bg-[#FDE7EB] transition-colors duration-200 flex items-center justify-center"
                      onClick={() => handleIgnore(alumni.email)}
                    >
                      Ignore
                    </button>

                    {alumni.isRequested ? (
                      <button
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleUnsendRequest(alumni.email)}
                      >
                        Unsend
                        <XCircle className="h-4 w-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleConnect(alumni.email)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
