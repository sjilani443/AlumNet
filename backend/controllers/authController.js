import User from '../models/User.js';
import Alumni from '../models/Alumni.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';



// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, graduationYear, department, company, position, role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    if (role === 'alumni') {
      // Register as Alumni
      const existingAlumni = await Alumni.findOne({ email });
      console.log(existingAlumni)
      if (existingAlumni) {
        return res.status(400).json({ message: 'Alumni already registered' });
      }

      const alumni = new Alumni({
        name,
        email,
        graduationYear,
        branch: department,
        company,
        currentRole: position,
      });

      await alumni.save();
      return res.status(201).json({ message: 'Alumni registered successfully' });

    } else if (role === 'student') {
      // Register as User (Student)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
      }

      const user = new User({
        name,
        email,
        password,
        graduationYear,
        department,
        role,
      });

      await user.save();
      return res.status(201).json({ message: 'Student registered successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    let user;

    if (role === 'student') {
      user = await User.findOne({ email }).select('+password'); // ✅ Explicitly select password

      if (!user) {
        return res.status(401).json({ message: 'Student not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

    } else if (role === 'alumni') {
      user = await Alumni.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Alumni not found' });
      }

      // Password is not required for alumni, so we skip password check
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const token = generateToken(user._id, role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};