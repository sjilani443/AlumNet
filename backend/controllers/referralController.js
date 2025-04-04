import Referral from '../models/Referral.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Create a referral posting (Alumni only)
// @route   POST /api/referrals
// @access  Private (Alumni)
export const createReferral = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, position, description, requirements, location, type, referralLink } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can post referrals' });
    }

    const referral = await Referral.create({
      alumni: user._id,
      company,
      position,
      description,
      requirements,
      location,
      type,
      referralLink,
    });

    res.status(201).json({ success: true, data: referral });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all referrals
// @route   GET /api/referrals
// @access  Public
export const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('requestedBy', 'name email')
      .populate('alumni', 'name email company');
      // console.log(referrals)
    res.json({ success: true, count: referrals.length, data: referrals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request a referral (Students only)
// @route   POST /api/referrals/:id/request
// @access  Private (Students)
export const requestReferral = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can request referrals' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });

    if (referral.requestedBy.some(requester => requester.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'Already requested referral' });
    }

    referral.requestedBy.push(user._id);
    await referral.save();

    res.json({ success: true, data: referral });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Withdraw referral request
// @route   DELETE /api/referrals/:id/withdraw
// @access  Private (Students)
export const withdrawReferral = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can withdraw requests' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });

    referral.requestedBy = referral.requestedBy.filter(requester => requester.toString() !== user._id.toString());
    await referral.save();

    res.json({ success: true, message: 'Referral request withdrawn' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
