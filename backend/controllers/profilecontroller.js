import Alumni from '../models/Alumni.js';
import Student from '../models/User.js';


// Fetch all details of a specific user by ID
export const getUserDetails = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const student = await Student.findOne({ email });
      // console.log(student)
      if (!student) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  export const getUserName = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const student = await Student.findOne({ email }).select('name');
  
      if (!student) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ name: student.name });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  export const getUserbranch = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const student = await Student.findOne({ email }).select('name department');
  
      if (!student) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ name: student.name, department:student.department });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// Update user profile by ID
export const updateUserProfile = async (req, res) => {
    const { name, email, age, address, graduationYear, department, bio, skills } = req.body;
  
    try {
      const student = await Student.findById(req.params.id);
  
      if (!student) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update all fields from req.body dynamically
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          student[key] = req.body[key];
        }
      });
  
      const updatedStudent = await student.save();
      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  // Get alumni profile by email
  export const getAlumniProfile = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const alumni = await Alumni.findOne({ email });
  
      if (!alumni) {
        return res.status(404).json({ message: 'Alumni not found' });
      }
  
      res.status(200).json(alumni);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  export const updateAlumniProfile = async (req, res) => {
    try {
      const alumni = await Alumni.findById(req.params.id);
  
      if (!alumni) {
        return res.status(404).json({ message: 'Alumni not found' });
      }
  
      // Dynamically update all provided fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          alumni[key] = req.body[key];
        }
      });
  
      const updatedAlumni = await alumni.save();
      res.status(200).json(updatedAlumni);
    } catch (error) {
      console.error('Error updating alumni profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Get full details of users who sent requests to an alumni
export const getRequestSenders = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'Alumni email is required' });
  }

  try {
    // 1. Find the alumni by email
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // 2. Get the array of request emails
    const requestEmails = alumni.requests || [];

    if (requestEmails.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Fetch all user (student) details matching those emails
    const students = await Student.find({ email: { $in: requestEmails } });

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching request senders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

  

  
