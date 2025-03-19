import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

export default function EventsList({ limit }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events'); // Adjust the URL
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(limit ? data.slice(0, limit) : data); // Slice data if limit is provided
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                {event.type}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {event.date} at {event.time}
              </div>
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {event.attendees} / {event.maxCapacity} attending
              </div>
            </div>
            <p className="mt-4 text-gray-600">{event.description}</p>
            {event.speaker && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Featured Speaker</h4>
                <p className="text-gray-600">{event.speaker}</p>
                <p className="text-sm text-gray-500">{event.speakerRole}</p>
              </div>
            )}
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200">
                Add to Calendar
              </button>
              <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center">
                Register Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
