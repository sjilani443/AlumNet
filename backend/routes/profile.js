import express from 'express';
import { getUserDetails, updateUserProfile, getUserName ,getUserbranch} from '../controllers/profilecontroller.js';

const router = express.Router();

// Route to fetch student profile by email
router.get('/', getUserDetails); 

// Route to update student profile by id (no change here)
router.put('/:id', updateUserProfile);

router.get('/name',getUserName);

router.get('/nameand',getUserbranch);
export default router;
