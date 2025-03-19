import React from 'react';
import EventsList from '../components/EventsList';

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
      <EventsList />
    </div>
  );
}