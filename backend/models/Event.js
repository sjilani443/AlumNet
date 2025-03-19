import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Virtual Event", "In-Person"], required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String },
  description: { type: String, required: true },
  speaker: { type: String },
  speakerRole: { type: String },
  attendees: { type: Number, default: 0 },
  maxCapacity: { type: Number, required: true },
});

const Event = mongoose.model("Event", eventSchema);
export default Event
