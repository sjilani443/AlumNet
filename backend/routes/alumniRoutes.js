import express from 'express';
import { getAllCompanies, getAlumniByCompany } from '../controllers/alumniController.js';

const router = express.Router();

router.get('/companies', getAllCompanies); // Fetch all unique companies
router.get('/companies/:companyName/alumni', getAlumniByCompany);

export default router;
