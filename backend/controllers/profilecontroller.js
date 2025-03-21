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
  
