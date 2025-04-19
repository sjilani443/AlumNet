import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AddEvent from "./AddEvent";

export default function EventsList({ limit }) {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("email"); // ✅ Get email from local storage
  const userRole = localStorage.getItem("role"); // Get user role from localStorage

  // ✅ Fetch Events & Registered Events
  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, [limit, userEmail]); // ✅ Re-run when userEmail or limit changes

  // ✅ Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(limit ? response.data.slice(0, limit) : response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user's registered events (Ensures correct button state)
  const fetchRegisteredEvents = async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/events/user/${userEmail}/registered`);
      const registeredIds = new Set(response.data.map((event) => event._id));

      setRegisteredEvents(registeredIds);
      localStorage.setItem("registeredEvents", JSON.stringify([...registeredIds])); // ✅ Persist state
    } catch (err) {
      console.error("Error fetching registered events:", err);
    }
  };

  // ✅ Ensure correct button state on reload
  useEffect(() => {
    const storedEvents = localStorage.getItem("registeredEvents");
    if (storedEvents) {
      setRegisteredEvents(new Set(JSON.parse(storedEvents)));
    }
  }, []);

  // ✅ Handle Register
  const handleRegister = async (eventId) => {
    const userEmail = localStorage.getItem("email");
    const userRole = localStorage.getItem("role");
    try {
      if (!userEmail) {
        toast.error("User not logged in");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/events/register`,
        {
          email: userEmail,
          role: userRole,
          eventId: eventId, // This is correct
        }
      );

      if (response.status === 200) {
        toast.success("Successfully registered for the event! 🎉");

        setRegisteredEvents((prev) => {
          const updatedSet = new Set([...prev, eventId]);
          localStorage.setItem("registeredEvents", JSON.stringify([...updatedSet])); // ✅ Persist state
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error(error.response?.data?.message || "Failed to register for event");
    }
  };

  // ✅ Handle Unregister
  const handleUnregister = async (eventId) => {
    const userEmail = localStorage.getItem("email");
    const userRole = localStorage.getItem("role");
    try {
      if (!userEmail) {
        toast.error("User not logged in");
        return;
      }
  
      const response = await axios.post(`http://localhost:5000/api/events/unregister`, {
        email: userEmail,
        role: userRole,
        eventId: eventId,
      });
  
      if (response.status === 200) {
        toast.success("Successfully unregistered from the event.");
  
        setRegisteredEvents((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(eventId);
          localStorage.setItem("registeredEvents", JSON.stringify([...updatedSet])); // ✅ Persist state
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error unregistering from event:", error);
      toast.error(error.response?.data?.message || "Failed to unregister from event");
    }
  };
  

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
              {registeredEvents.has(event._id) ? (
                <>
                  <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center justify-center cursor-default">
                    Registered <CheckCircle className="h-4 w-4 ml-2" />
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center"
                    onClick={() => handleUnregister(event._id)}
                  >
                    Unregister <XCircle className="h-4 w-4 ml-2" />
                  </button>
                </>
              ) : (
                <button
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                  onClick={() => handleRegister(event._id)}
                >
                  Register Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
    {userRole === 'alumni' && (
      <div className="mt-12">
        <AddEvent />
      </div>
    )}
    </>
  );
}
