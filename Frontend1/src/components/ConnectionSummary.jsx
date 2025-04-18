import React, { useEffect, useState } from "react";

export default function ConnectionSummary() {
  const [alumni, setAlumni] = useState(null);
  const [pendingRequestUsers, setPendingRequestUsers] = useState([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchSummary = async () => {
      if (!email || !token) {
        setError("Missing token or email.");
        setLoading(false);
        return;
      }

      try {
        // Fetch alumni profile by email
        const res = await fetch(
          `http://localhost:5000/api/alumni/email/${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch alumni data");
        const data = await res.json();
        setAlumni(data);

        // Fetch details of users who sent requests to this alumni
        const requestSendersRes = await fetch(
          `http://localhost:5000/api/profile/alumni/request-senders?email=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (requestSendersRes.ok) {
          const senders = await requestSendersRes.json();
          setReceivedRequestUsers(senders);
        }

        // Fetch details of alumni to whom this alumni has sent requests
        if (Array.isArray(data.pendingRequests)) {
          const pending = await Promise.all(
            data.pendingRequests.map(async (pendingEmail) => {
              const res = await fetch(
                `http://localhost:5000/api/alumni/email/${pendingEmail}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return await res.json();
            })
          );
          setPendingRequestUsers(pending);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [email, token]);

  const handleApprove = (requestEmail) => {
    // 1. Remove user from received requests
    setReceivedRequestUsers((prev) =>
      prev.filter((user) => user.email !== requestEmail)
    );
  
    // 2. Increase follower count
    setAlumni((prevAlumni) => ({
      ...prevAlumni,
      followersCount: (prevAlumni.followersCount || 0) + 1,
    }));
  };
  
  
  const handleDecline = (requestEmail) => {
    setReceivedRequestUsers((prev) =>
      prev.filter((user) => user.email !== requestEmail)
    );
  };
  

  if (loading) return <p className="text-center text-gray-500 mt-4">Loading your details...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!alumni) return <p className="text-center text-gray-500 mt-4">No alumni found for this email.</p>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Connection Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{alumni.followersCount || 0}</p>
          <p className="text-sm text-gray-600">Followers</p>
        </div>

        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{receivedRequestUsers.length}</p>
          <p className="text-sm text-gray-600">Requests Received</p>
        </div>
      </div>

      {/* Requests You Sent (Pending) */}
      {pendingRequestUsers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Requests You Sent</h3>
          <ul className="space-y-3">
            {pendingRequestUsers.map((req, idx) => (
              <li key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <img
                    src={req.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                    alt={req.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.email}</p>
                    {req.course && <p className="text-sm text-gray-500">Course: {req.course}</p>}
                    {req.batch && <p className="text-sm text-gray-500">Batch: {req.batch}</p>}
                    {req.location && <p className="text-sm text-gray-500">Location: {req.location}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requests Received */}
      {receivedRequestUsers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Connection Requests Received</h3>
          <ul className="space-y-3">
            {receivedRequestUsers.map((user, idx) => (
              <li key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <img
                    src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.course && <p className="text-sm text-gray-500">Course: {user.course}</p>}
                    {user.batch && <p className="text-sm text-gray-500">Batch: {user.batch}</p>}
                    {user.location && <p className="text-sm text-gray-500">Location: {user.location}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                    onClick={() => handleApprove(user.email)}
                  >
                    Accept
                  </button>
                  <button
                    className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                    onClick={() => handleDecline(user.email)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
