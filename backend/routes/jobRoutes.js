import express from 'express';
import {
  createReferral,
  getReferrals,
  requestReferral,
  withdrawReferral
} from '../controllers/referralController.js';
import { check } from 'express-validator';

const router = express.Router();

// @route   GET /api/referrals
// @desc    Get all referrals (Public)
router.get('/', getReferrals);

// @route   POST /api/referrals
// @desc    Post a referral
router.post(
  '/',
  [
    check('company', 'Company is required').notEmpty(),
    check('position', 'Position is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('type', 'Type is required').notEmpty()
  ],
  createReferral
);

// @route   POST /api/referrals/:id/request
// @desc    Request a referral
router.post('/:id/request', requestReferral);

// @route   DELETE /api/referrals/:id/withdraw
// @desc    Withdraw a referral request
router.delete('/:id/withdraw', withdrawReferral);

export default router;
