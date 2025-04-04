import React, { useEffect, useState } from "react";
import { Building2, MapPin, Shield, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function JobsList({ limit }) {
  const [jobs, setJobs] = useState([]);
  const [requestedJobs, setRequestedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get user email from localStorage
  const userEmail = localStorage.getItem("email") || "";

  // ✅ Fetch jobs & requested referrals when component mounts
  useEffect(() => {
    fetchJobs();
    fetchRequestedJobs();
  }, [limit, userEmail]);

  // ✅ Fetch all job referrals
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/referrals");
      console.log(response)
      setJobs(limit ? response.data.data.slice(0, limit) : response.data.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user's requested referrals (Ensures correct button state)
  const fetchRequestedJobs = async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/referrals/user/${userEmail}/requested`);
      const requestedIds = new Set(response.data.map((job) => job._id));

      setRequestedJobs(requestedIds);
      localStorage.setItem("requestedJobs", JSON.stringify([...requestedIds])); // Persist in localStorage
    } catch (err) {
      console.error("Error fetching requested jobs:", err);
    }
  };

  // ✅ Ensure correct button state on reload
  useEffect(() => {
    const storedRequests = localStorage.getItem("requestedJobs");
    if (storedRequests) {
      setRequestedJobs(new Set(JSON.parse(storedRequests)));
    }
  }, []);

  // ✅ Request a referral
  const handleReferralRequest = async (referralId) => {
    try {
      if (!userEmail) {
        toast.error("User not logged in");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/referrals/${referralId}/request`,
        { email: userEmail }
      );

      if (response.status === 200) {
        toast.success("Referral request sent successfully!");

        setRequestedJobs((prev) => {
          const updatedSet = new Set([...prev, referralId]);
          localStorage.setItem("requestedJobs", JSON.stringify([...updatedSet])); // ✅ Persist state
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error requesting referral:", error);
      toast.error(error.response?.data?.message || "Failed to request referral");
    }
  };

  // ✅ Withdraw a referral request
  const handleWithdrawRequest = async (referralId) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get JWT token

      if (!userEmail || !token) {
        toast.error("You must be logged in to withdraw a referral request.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/referrals/${referralId}/withdraw`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Authenticate request
          data: { email: userEmail } // ✅ Send email in request body
        }
      );

      if (response.status === 200) {
        toast.success("Referral request withdrawn successfully!");

        setRequestedJobs((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(referralId);
          localStorage.setItem("requestedJobs", JSON.stringify([...updatedSet])); // ✅ Persist state
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error withdrawing referral:", error);
      toast.error(error.response?.data?.message || "Failed to withdraw referral");
    }
  };

  if (loading) return <p>Loading referrals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="bg-primary-50 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Shield className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Alumni Referral Program
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              These positions have alumni from SRM AP who can provide referrals. A referral can significantly increase your chances of getting an interview.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.position}
                  </h3>
                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                    <Building2 className="h-4 w-4 mr-1" />
                    {job.company}
                  </div>
                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  {job.type}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600">{job.description}</p>

              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                {requestedJobs.has(job._id) ? (
                  <button
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm flex items-center justify-center"
                    onClick={() => handleWithdrawRequest(job._id)}
                  >
                    Withdraw Request <CheckCircle className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-800 transition-colors duration-200 text-sm flex items-center justify-center"
                    onClick={() => handleReferralRequest(job._id)}
                  >
                    Request Referral <CheckCircle className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
