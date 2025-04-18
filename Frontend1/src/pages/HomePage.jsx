import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import AlumniList from '../components/AlumniList';
import JobsList from '../components/JobsList';
import EventsList from '../components/EventsList';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Our Alumni Network</h2>
        </div>
        <AlumniList limit={9} onSeeAll={() => navigate('/student/companies')} />

        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <button
              onClick={() => {
                console.log('Navigating to /student/events');
                navigate('/student/events');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              See All
            </button>
          </div>
          <EventsList limit={2} />
        </div>

        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Job Referrals</h2>
            <button
              onClick={() => {
                console.log('Navigating to /student/jobs');
                navigate('/student/jobs');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              See All
            </button>
          </div>
          <JobsList limit={2} />
        </div>
      </div>
    </div>
  );
}
