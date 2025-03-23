import express from 'express';
import {
  createReferral,
  getReferrals,
  requestReferral,
  withdrawReferral
} from '../controllers/referralController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';

const router = express.Router();

// Alumni post a referral
router.post(
  '/',
  [
    protect,
    authorize('alumni'),
    [
      check('company', 'Company is required').not().isEmpty(),
      check('position', 'Position is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('type', 'Referral type is required').isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    ]
  ],
  createReferral
);

// Get all referrals
router.get('/', getReferrals);

// Student requests a referral
router.post('/:id/request', requestReferral);

// Student withdraws a referral request
router.delete('/:id/withdraw', withdrawReferral);

export default router;
