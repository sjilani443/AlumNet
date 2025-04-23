import Alumni from '../models/Alumni.js';
import User from '../models/User.js';
import Connection from '../models/Connection.js';

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
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    const alumni = await Alumni.findOne({ email });

    if (!user && !alumni) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get connections from either user or alumni
    const connections = user ? user.connections : alumni.connections;

    // Fetch full details of connected users
    const connectionDetails = await Promise.all(
      connections.map(async (conn) => {
        const connectedUser = await User.findOne({ email: conn.email }) || 
                            await Alumni.findOne({ email: conn.email });
        return {
          name: connectedUser.name,
          email: connectedUser.email,
          profileImage: connectedUser.profileImage || connectedUser.avatar,
          course: connectedUser.course || connectedUser.department,
          batch: connectedUser.batch || connectedUser.graduationYear
        };
      })
    );

    res.json({
      success: true,
      data: connectionDetails,
    });
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Get Pending Connection Requests**
export const getPendingRequests = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Fetch full details of users who sent requests
    const requestDetails = await Promise.all(
      alumni.requests.map(async (requestEmail) => {
        const user = await User.findOne({ email: requestEmail });
        return {
          name: user.name,
          email: user.email,
          profileImage: user.avatar,
          course: user.department,
          batch: user.graduationYear
        };
      })
    );

    res.json({
      success: true,
      data: requestDetails,
    });
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ **Approve Request**
export const approveConnectionRequest = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: 'From and To emails are required' });
    }

    // Find sender and receiver by email
    const sender = await User.findOne({ email: from });
    const receiver = await Alumni.findOne({ email: to }); // Or User, based on use case

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }

    // Find the pending connection request
    const connection = await Connection.findOne({
      sender: sender._id,
      receiver: receiver._id,
      status: 'pending'
    });

    if (!connection) {
      return res.status(404).json({ message: 'No pending connection request found' });
    }

    // Update the status to accepted
    connection.status = 'accepted';
    await connection.save();

    res.status(200).json({ message: 'Connection approved successfully' });
  } catch (error) {
    console.error('Error in approveConnectionRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

