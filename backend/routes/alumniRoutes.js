import express from 'express';
import { getAllCompanies, getAlumniByCompany, getAllAlumni, getAlumniByEmail } from '../controllers/alumniController.js';

const router = express.Router();

// ✅ Fetch all alumni
router.get('/', getAllAlumni);


// ✅ Fetch all unique companies
router.get('/companies', getAllCompanies);

// ✅ Fetch alumni by company name
router.get('/companies/:companyName/alumni', getAlumniByCompany);

router.get('/email/:email', getAlumniByEmail);

export default router;
