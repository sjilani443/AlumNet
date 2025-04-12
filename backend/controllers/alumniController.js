import Alumni from '../models/Alumni.js';

// ✅ Get all alumni
export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    
    if (!alumni.length) {
      return res.status(404).json({ message: "No alumni found" });
    }

    res.status(200).json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all unique companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Alumni.distinct("company");
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get alumni by company
export const getAlumniByCompany = async (req, res) => {
  try {
    const { companyName } = req.params;
    const alumni = await Alumni.find({ company: companyName });

    if (!alumni.length) {
      return res.status(404).json({ message: "No alumni found in this company" });
    }

    res.status(200).json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get alumni by email
export const getAlumniByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found with this email" });
    }

    res.status(200).json(alumni);
  } catch (error) {
    console.error("Error fetching alumni by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

