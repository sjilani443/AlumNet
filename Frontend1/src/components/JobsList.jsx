import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Shield } from 'lucide-react';
import axios from 'axios';

export default function JobsList({ limit }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/get');
        const data = response.data.data;

        if (data && Array.isArray(data)) {
          const limitedJobs = limit ? data.slice(0, limit) : data;
          setJobs(limitedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [limit]); // Dependency added to re-fetch if limit changes

  return (
    <div>
      <div className="bg-primary-50 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Shield className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Alumni Referral Program</h3>
            <p className="text-sm text-gray-600 mt-1">
              These positions have alumni from SRM AP who can provide referrals. A referral can significantly increase your chances of getting an interview.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
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
                <h4 className="text-sm font-medium text-gray-900 mb-1">Requirements:</h4>
                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <button className="mt-3 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm flex items-center justify-center">
                  Request Referral
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
