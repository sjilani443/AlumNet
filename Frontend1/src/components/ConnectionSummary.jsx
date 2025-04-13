import React, { useEffect, useState } from 'react';

export default function ConnectionSummary() {
  const [alumni, setAlumni] = useState(null);
  const [pendingRequestUsers, setPendingRequestUsers] = useState([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchSummary = async () => {
      if (!email || !token) {
        setError('Missing token or email.');
        setLoading(false);
        return;
      }

      try {
        // Get alumni data by email
        const res = await fetch(`http://localhost:5000/api/alumni/email/${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch alumni data');
        const data = await res.json();
        setAlumni(data);

        // Fetch pendingRequests (as Alumni)
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

        // Fetch request senders (as Students) using your new API
        const reqRes = await fetch(`http://localhost:5000/api/profile/alumni/request-senders?email=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (reqRes.ok) {
          const students = await reqRes.json();
          setReceivedRequestUsers(students);
        } else {
          console.warn('Failed to fetch request senders');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [email, token]);

  const handleApprove = async (requestEmail) => {
    try {
      const res = await fetch('http://localhost:5000/api/alumni/approve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ from: requestEmail, to: email }),
      });

      if (!res.ok) throw new Error('Failed to approve request');
      window.location.reload();
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const handleDecline = async (requestEmail) => {
    try {
      const res = await fetch('http://localhost:5000/api/alumni/decline-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ from: requestEmail, to: email }),
      });

      if (!res.ok) throw new Error('Failed to decline request');
      window.location.reload();
    } catch (err) {
      console.error('Decline error:', err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading your details...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-4">{error}</p>;

  if (!alumni)
    return <p className="text-center text-gray-500 mt-4">No alumni found for this email.</p>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Connection Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{alumni.followersCount || 0}</p>
          <p className="text-sm text-gray-600">Followers</p>
        </div>

        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{receivedRequestUsers.length || 0}</p>
          <p className="text-sm text-gray-600">Requests Received</p>
        </div>
      </div>

      {/* Requests to Approve */}
      {pendingRequestUsers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Requests to Approve</h3>
          <ul className="space-y-3">
            {pendingRequestUsers.slice(0, 5).map((req, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.profileImage}
                    alt={req.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.email}</p>
                    {req.course && <p className="text-sm text-gray-500">Course: {req.course}</p>}
                    {req.batch && <p className="text-sm text-gray-500">Batch: {req.batch}</p>}
                    {req.location && (
                      <p className="text-sm text-gray-500">Location: {req.location}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                    onClick={() => handleApprove(req.email)}
                  >
                    Approve
                  </button>
                  <button
                    className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                    onClick={() => handleDecline(req.email)}
                  >
                    Decline
                  </button>
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
            {receivedRequestUsers.slice(0, 5).map((user, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4537/4537019.png"
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.course && <p className="text-sm text-gray-500">Course: {user.course}</p>}
                  {user.batch && <p className="text-sm text-gray-500">Batch: {user.batch}</p>}
                  {user.location && (
                    <p className="text-sm text-gray-500">Location: {user.location}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
