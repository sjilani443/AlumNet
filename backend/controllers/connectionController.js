import Alumni from '../models/Alumni.js';
import User from '../models/User.js';

// ✅ **Send Connection Request**
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userEmail, alumniEmail } = req.body;

    if (!userEmail || !alumniEmail) {
      return res.status(400).json({ message: 'User email and Alumni email are required' });
    }

    const user = await User.findOne({ email: userEmail });
    const alumni = await Alumni.findOne({ email: alumniEmail });

    if (!user || !alumni) {
      return res.status(404).json({ message: 'User or Alumni not found' });
    }

    // ✅ Check if request already exists
    if (alumni.requests.includes(userEmail)) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // ✅ Add request to alumni's request list
    alumni.requests.push(userEmail);
    await alumni.save();

    res.status(201).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Error in sendConnectionRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Unsend Connection Request**
export const unsendConnectionRequest = async (req, res) => {
  try {
    const { userEmail, alumniEmail } = req.body;

    if (!userEmail || !alumniEmail) {
      return res.status(400).json({ message: 'User email and Alumni email are required' });
    }

    const alumni = await Alumni.findOne({ email: alumniEmail });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // ✅ Remove request if it exists
    if (!alumni.requests.includes(userEmail)) {
      return res.status(400).json({ message: 'No request found from this user' });
    }

    alumni.requests = alumni.requests.filter((email) => email !== userEmail);
    await alumni.save();

    res.json({ message: 'Connection request unsent successfully' });
  } catch (error) {
    console.error('Error in unsendConnectionRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Accept/Decline Connection Request**
export const updateConnectionStatus = async (req, res) => {
  try {
    const { userEmail, alumniEmail, status } = req.body; // `status`: 'accepted' or 'declined'

    if (!userEmail || !alumniEmail || !status) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const user = await User.findOne({ email: userEmail });
    const alumni = await Alumni.findOne({ email: alumniEmail });

    if (!user || !alumni) {
      return res.status(404).json({ message: 'User or Alumni not found' });
    }

    // ✅ Check if request exists
    if (!alumni.requests.includes(userEmail)) {
      return res.status(400).json({ message: 'No pending request from this user' });
    }

    if (status === 'accepted') {
      // ✅ Move from requests to connections
      alumni.requests = alumni.requests.filter((email) => email !== userEmail);
      user.connections.push({ name: alumni.name, email: alumni.email });
      alumni.connections.push({ name: user.name, email: user.email });

      await alumni.save();
      await user.save();
    } else if (status === 'declined') {
      // ✅ Remove request without adding to connections
      alumni.requests = alumni.requests.filter((email) => email !== userEmail);
      await alumni.save();
    }

    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    console.error('Error updating connection status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Get User's Connections**
export const getConnections = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.connections,
    });
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Get Pending Connection Requests**
export const getPendingRequests = async (req, res) => {
  try {
    const alumni = await Alumni.findOne({ email: req.user.email });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.json({
      success: true,
      data: alumni.requests,
    });
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
