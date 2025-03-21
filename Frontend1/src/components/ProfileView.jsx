import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, GraduationCap, Calendar, Edit2 } from 'lucide-react';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        setError('Token or email not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfile({ ...data, id: data._id });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !profile) return;

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${profile.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Edit2 className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <div className="relative px-6 py-8">
          <div className="absolute -top-16 left-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFwK4Wma5qIhs7KpmZAVrY15ohVQB3Pg4cg&s"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="mt-16">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Name', field: 'name' },
                    { label: 'Email', field: 'email' },
                    { label: 'Phone', field: 'phone' },
                    { label: 'Location', field: 'location' },
                    { label: 'Graduation Year', field: 'graduationYear' },
                    { label: 'Department', field: 'department' },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">{label}</label>
                      <input
                        type="text"
                        value={profile[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={profile.skills?.join(', ') || ''}
                      onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(skill => skill.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600"><Mail className="h-5 w-5 mr-2" />{profile.email}</div>
                    <div className="flex items-center text-gray-600"><Phone className="h-5 w-5 mr-2" />{profile.phone}</div>
                    <div className="flex items-center text-gray-600"><MapPin className="h-5 w-5 mr-2" />{profile.location}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600"><GraduationCap className="h-5 w-5 mr-2" />{profile.department}</div>
                    <div className="flex items-center text-gray-600"><Calendar className="h-5 w-5 mr-2" />Class of {profile.graduationYear}</div>
                  </div>
                </div>
                {profile.bio && <div className="mt-6"><h3 className="text-lg font-semibold text-gray-900">About</h3><p className="mt-2 text-gray-600">{profile.bio}</p></div>}
                <div className="mt-6"><h3 className="text-lg font-semibold text-gray-900">Skills</h3><div className="mt-2 flex flex-wrap gap-2">{profile.skills.map(skill => <span key={skill} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">{skill}</span>)}</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
