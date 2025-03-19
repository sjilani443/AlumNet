import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  applyForJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  [
    protect,
    authorize('alumni'),
    [
      check('company', 'Company is required').not().isEmpty(),
      check('position', 'Position is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('type', 'Job type is required').isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    ]
  ],
  createJob
);

router.get('/get', getJobs);
router.get('/:id', getJob);
router.post('/:id/apply', protect, authorize('student'), applyForJob);

export default router;