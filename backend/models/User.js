import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'alumni'],
    required: true
  },
  company: {
    type: String,
    required: function() { return this.role === 'alumni'; }
  },
  position: {
    type: String,
    required: function() { return this.role === 'alumni'; }
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  bio: String,
  graduationYear: Number,
  department: String,
  skills: [String],
  connections: [
    {
      name: String,
      email: String,
    },
  ],
  phone: {
    type: String,
    match: [
      /^\d{10}$/,
      'Please add a valid phone number'
    ]
  },
  location: {
    type: String,
    trim: true
  },
  registeredEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event' // Reference to the Event model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
