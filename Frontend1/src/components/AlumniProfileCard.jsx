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
  X
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

  if (loading) return <p className="text-center py-8 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!alumni) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden p-8 mt-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img
            src={alumni.profileImage}
            alt={alumni.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 shadow-md"
          />
          <div>
            {isEditing ? (
              <>
                <input
                  className="text-xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-primary-500"
                  value={alumni.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-800">{alumni.name}</h1>
                <p className="text-sm text-gray-500">
                  Class of {alumni.graduationYear} · {alumni.branch}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-x-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-primary-600 text-white px-3 py-2 rounded hover:bg-primary-700">
                <Save className="h-5 w-5 inline" /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">
                <X className="h-5 w-5 inline" /> Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-white px-3 py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50">
              <Edit2 className="h-5 w-5 inline" /> Edit
            </button>
          )}
        </div>
      </div>

      <hr className="my-6 border-primary-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        {[
          { label: 'Email', value: alumni.email, field: 'email', icon: <Mail className="h-5 w-5 mr-2" /> },
          { label: 'Phone', value: alumni.phoneNumber, field: 'phoneNumber', icon: <Phone className="h-5 w-5 mr-2" /> },
          { label: 'Graduation Year', value: alumni.graduationYear, field: 'graduationYear', icon: <Calendar className="h-5 w-5 mr-2" /> },
          { label: 'Department', value: alumni.branch, field: 'branch', icon: <GraduationCap className="h-5 w-5 mr-2" /> },
          { label: 'Current Role', value: alumni.currentRole, field: 'currentRole', icon: <Briefcase className="h-5 w-5 mr-2" /> },
          { label: 'Company', value: alumni.company, field: 'company', icon: <MapPin className="h-5 w-5 mr-2" /> },
          { label: 'LinkedIn', value: alumni.linkedin, field: 'linkedin', icon: <Linkedin className="h-5 w-5 mr-2" /> },
        ].map(({ label, value, field, icon }) => (
          <div className="flex items-start" key={label}>
            {icon}
            {isEditing ? (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={label}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-primary-500"
              />
            ) : (
              <span>{value || '—'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
