import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Link } from 'lucide-react';

export default function CompanyDetails() {
  const { companyName } = useParams();
  const [alumni, setAlumni] = useState([]);
  
  // Ensure the email exists
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/alumni/companies/${companyName}/alumni`);

        const alumniData = response.data.map((person) => ({
          ...person,
          isConnected: person.connections?.some((connection) => connection.email === userEmail) || false,
          isRequested: person.requests?.includes(userEmail) || false,
        }));

        setAlumni(alumniData);
      } catch (error) {
        console.error('Error fetching alumni:', error);
      }
    };

    if (userEmail) fetchAlumni(); // Fetch only if user email is available
  }, [companyName, userEmail]);

  const handleConnect = async (alumniEmail) => {
    try {
      // Send request to backend
      await axios.post('http://localhost:5000/api/connections/request', {
        userEmail,
        alumniEmail,
      });
  
      toast.success('Connection request sent successfully!', { position: 'top-center' });
  
      // ✅ Optimistically update UI without fetching again
      setAlumni((prevAlumni) =>
        prevAlumni.map((person) =>
          person.email === alumniEmail ? { ...person, isRequested: true } : person
        )
      );
  
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error('Connection failed');
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Alumni from {decodeURIComponent(companyName)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {alumni.map((person) => (
          <div
            key={person._id || person.email} // Use email as fallback key
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center gap-4 transition-transform hover:shadow-2xl hover:scale-105"
          >
            {/* Profile Image */}
            <img
              src={person.profileImage || 'https://via.placeholder.com/100'}
              alt={person.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-300"
            />

            {/* Name & Role */}
            <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
            <p className="text-sm text-gray-500">{person.currentRole}</p>
            <p className="text-xs text-gray-400">Batch of {person.graduationYear}</p>

            {/* LinkedIn Profile */}
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 flex items-center gap-2 hover:underline"
            >
              <Link className="h-4 w-4" />
              View LinkedIn Profile
            </a>

            {/* Connection & Message Buttons */}
            <div className="flex gap-4 w-full">
              {/* Connection Button */}
              <button
                onClick={() => handleConnect(person.email)}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 text-white font-semibold ${
                  person.isConnected
                    ? 'bg-gray-400 text-gray-800 cursor-not-allowed'  // ⚪ Connected (Gray)
                    : person.isRequested
                    ? 'bg-yellow-500 text-white cursor-not-allowed' // 🟡 Request Sent (Yellow)
                    : 'bg-green-700 text-yellow-300 hover:bg-green-800'  // 🟢 Default Connect (Dark Green with Yellow Shade)
                }`}
                disabled={person.isConnected || person.isRequested}
              >
                {person.isConnected ? 'Connected' : person.isRequested ? 'Request Sent' : 'Connect'}
              </button>

              {/* Message Button */}
              <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-all duration-200">
                <Mail className="h-5 w-5 mr-2" />
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
