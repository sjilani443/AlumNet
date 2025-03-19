import Alumni from '../models/Alumni.js';

// Get all unique company names
export const getAllCompanies = async (req, res) => {
  try {
    // console.log("Inside Controller");
    const companies = await Alumni.distinct('company');
    res.status(200).json(companies);
    // console.log(companies)
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get alumni based on company
export const getAlumniByCompany = async (req, res) => {
  try {
    const { companyName } = req.params;
    const alumni = await Alumni.find({ company: companyName });

    if (!alumni.length) {
      return res.status(404).json({ message: 'No alumni found in this company' });
    }

    res.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

