import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, UserPlus, Users } from "lucide-react";

export default function ConnectionSummary() {
  const [alumni, setAlumni] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      if (!email || !token) {
        setError("Missing token or email.");
        setLoading(false);
        return;
      }

      try {
        // Fetch alumni profile
        const alumniRes = await axios.get(
          `http://localhost:5000/api/alumni/email/${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlumni(alumniRes.data);

        // Fetch pending connection requests
        const requestsRes = await axios.get(
          "http://localhost:5000/api/connections/pending",
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { email }
          }
        );
        setReceivedRequests(requestsRes.data.data || []);

        // Fetch connections
        const connectionsRes = await axios.get(
          "http://localhost:5000/api/connections",
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { email }
          }
        );
        setConnections(connectionsRes.data.data || []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, token]);

  const handleApprove = async (requestEmail) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/connections/status",
        {
          userEmail: requestEmail,
          alumniEmail: email,
          status: "accepted"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setReceivedRequests(prev => prev.filter(req => req.email !== requestEmail));
        
        // Fetch the updated connections list
        const connectionsRes = await axios.get(
          "http://localhost:5000/api/connections",
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { email }
          }
        );
        setConnections(connectionsRes.data.data || []);
        
        // Update alumni followers count
        setAlumni(prev => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1
        }));

        toast.success("Connection request accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
      toast.error("Failed to accept connection request");
    }
  };

  const handleDecline = async (requestEmail) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/connections/status",
        {
          userEmail: requestEmail,
          alumniEmail: email,
          status: "declined"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setReceivedRequests(prev => prev.filter(req => req.email !== requestEmail));
        toast.success("Connection request declined successfully!");
      }
    } catch (error) {
      console.error("Error declining connection request:", error);
      toast.error("Failed to decline connection request");
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-4">Loading your details...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!alumni) return <p className="text-center text-gray-500 mt-4">No alumni found for this email.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Connection Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-primary-50 p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-primary-600">{receivedRequests.length}</p>
            <p className="text-sm text-gray-600 mt-2">Connection Requests</p>
          </div>

          <div className="bg-primary-50 p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-primary-600">{connections.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total Connections</p>
          </div>
        </div>

        {/* Connection Requests */}
        {receivedRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary-600" />
              Connection Requests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receivedRequests.map((request, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4537/4537019.png"
                      alt={request.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{request.name}</p>
                      <p className="text-sm text-gray-500">{request.email}</p>
                      {request.course && <p className="text-sm text-gray-500">Course: {request.course}</p>}
                      {request.batch && <p className="text-sm text-gray-500">Batch: {request.batch}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      onClick={() => handleApprove(request.email)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                      onClick={() => handleDecline(request.email)}
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Connections */}
        {connections.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              Your Connections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4537/4537019.png"
                      alt={connection.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{connection.name}</p>
                      <p className="text-sm text-gray-500">{connection.email}</p>
                      {connection.course && <p className="text-sm text-gray-500">Course: {connection.course}</p>}
                      {connection.batch && <p className="text-sm text-gray-500">Batch: {connection.batch}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
