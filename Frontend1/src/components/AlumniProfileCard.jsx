import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Linkedin,
  Calendar,
  Edit2,
  Save,
  X,
  UserCircle
} from 'lucide-react';

export default function AlumniProfileView() {
  const [alumni, setAlumni] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/alumni?email=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch alumni profile');
        const data = await res.json();
        setAlumni(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [email, token]);

  const handleInputChange = (field, value) => {
    setAlumni({ ...alumni, [field]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/alumni/${alumni._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alumni),
      });

      if (!res.ok) throw new Error('Failed to update alumni profile');
      const updated = await res.json();
      setAlumni(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-red-500 text-center">{error}</p>
    </div>
  );
  
  if (!alumni) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-yellow-500 to-yellow-400">
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 bg-white text-yellow-600 rounded-xl hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white text-yellow-600 rounded-xl hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 py-8">
          {/* Profile Image */}
          <div className="absolute -top-16 left-6">
            <div className="relative group">
              <img
                src={alumni.profileImage || "https://cdn-icons-png.flaticon.com/512/4537/4537019.png"}
                alt={alumni.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16">
            <div className="mb-8">
              {isEditing ? (
                <input
                  className="text-3xl font-bold text-gray-900 border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded px-2 py-1"
                  value={alumni.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
              )}
              <p className="text-gray-500 mt-2">
                Class of {alumni.graduationYear} · {alumni.branch}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Email', value: alumni.email, field: 'email', icon: <Mail className="h-5 w-5 text-gray-500" /> },
                { label: 'Phone', value: alumni.phoneNumber, field: 'phoneNumber', icon: <Phone className="h-5 w-5 text-gray-500" /> },
                { label: 'Graduation Year', value: alumni.graduationYear, field: 'graduationYear', icon: <Calendar className="h-5 w-5 text-gray-500" /> },
                { label: 'Department', value: alumni.branch, field: 'branch', icon: <GraduationCap className="h-5 w-5 text-gray-500" /> },
                { label: 'Current Role', value: alumni.currentRole, field: 'currentRole', icon: <Briefcase className="h-5 w-5 text-gray-500" /> },
                { label: 'Company', value: alumni.company, field: 'company', icon: <MapPin className="h-5 w-5 text-gray-500" /> },
                { label: 'LinkedIn', value: alumni.linkedin, field: 'linkedin', icon: <Linkedin className="h-5 w-5 text-gray-500" /> },
              ].map(({ label, value, field, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {icon}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={label}
                      className="flex-1 bg-transparent border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-gray-700">{value || '—'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
