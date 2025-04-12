import React, { useEffect, useState } from 'react';

export default function ConnectionSummary() {
  const [alumni, setAlumni] = useState(null);
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
        const res = await fetch(`http://localhost:5000/api/alumni/email/${encodeURIComponent(email)}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          

        if (!res.ok) {
          throw new Error('Failed to fetch alumni data');
        }

        const data = await res.json();
        console.log(data)
        setAlumni(data); // Assuming the response is the alumni object
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch alumni data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [email, token]);

  if (loading) return <p className="text-center text-gray-500 mt-4">Loading your details...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!alumni) return <p className="text-center text-gray-500 mt-4">No alumni found for this email.</p>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Connection Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{alumni.followersCount || 0}</p>
          <p className="text-sm text-gray-600">Followers</p>
        </div>
        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{alumni.sentRequestsCount || 0}</p>
          <p className="text-sm text-gray-600">Requests Sent</p>
        </div>
        <div className="bg-primary-50 p-5 rounded-lg">
          <p className="text-3xl font-bold text-primary-600">{alumni.pendingRequests?.length || 0}</p>
          <p className="text-sm text-gray-600">Pending Approvals</p>
        </div>
      </div>

      {alumni.pendingRequests?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Requests to Approve</h3>
          <ul className="space-y-3">
            {alumni.pendingRequests.slice(0, 3).map((req, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <img src={req.profileImage} alt={req.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.email}</p>
                  </div>
                </div>
                <button
                  className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700"
                  onClick={() => console.log(`Approve ${req.email}`)} // Handle approve logic here
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alumni.pendingRequests?.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No pending requests to approve</p>
      )}
    </div>
  );
}
