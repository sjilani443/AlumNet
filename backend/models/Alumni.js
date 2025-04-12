import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String },
  graduationYear: { type: Number, required: true },
  currentRole: { type: String },
  company: { type: String },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String },
  linkedin: { type: String },
  profileImage: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s',
  },
  connections: [
    {
      name: String,
      email: String,
    },
  ],
  requests: [
    {
      type: String, // Store user emails who sent a request
    },
  ],
}, { timestamps: true },{ versionKey: false });

const Alumni = mongoose.model('Alumni', alumniSchema);

export default Alumni;
