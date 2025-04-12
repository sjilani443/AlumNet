// src/components/ProfileReminder.jsx
import React from 'react';
import { UserCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileReminder() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6 py-5 border border-primary-200 rounded-xl bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-100 rounded-full text-primary-600">
          <UserCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-600">
            Complete your profile
          </h3>
          <p className="text-sm text-primary-400">
            Help others know more about your journey and expertise.
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/alumni/profile')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        Update Profile
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
