import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "",
    maxCapacity: "",
    speaker: "",
    speakerRole: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/events/create", formData);
      if (response.status === 201) {
        toast.success("Event created!");
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          type: "",
          maxCapacity: "",
          speaker: "",
          speakerRole: ""
        });
      }
    } catch (err) {
      toast.error("Error creating event");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Add New Event</h3>

      {[
        { label: "Title", name: "title", type: "text", required: true },
        { label: "Date", name: "date", type: "date", required: true },
        { label: "Time", name: "time", type: "time", required: true },
        { label: "Location", name: "location", type: "text" },
        { label: "Max Capacity", name: "maxCapacity", type: "number" },
        { label: "Speaker", name: "speaker", type: "text" },
        { label: "Speaker Role", name: "speakerRole", type: "text" },
      ].map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      ))}

      {/* Type Select Dropdown */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="">Select Type</option>
          <option value="Virtual Event">Virtual Event</option>
          <option value="In-Person">In-Person</option>
        </select>
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Create Event
      </button>
    </form>
  );
}
