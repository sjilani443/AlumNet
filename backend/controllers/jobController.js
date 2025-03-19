import Job from '../models/Job.js';
import { validationResult } from 'express-validator';

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (Alumni only)
export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, position, description, requirements, location, type, referralLink } = req.body;

    // Check if user is alumni
    if (req.user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can post jobs' });
    }

    const job = await Job.create({
      alumni: req.user.id,
      company,
      position,
      description,
      requirements,
      location,
      type,
      referralLink
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log(jobs);
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('alumni', 'name email company position')
      .populate('applicants.user', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Students only)
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply for jobs' });
    }

    // Check if already applied
    if (job.applicants.some(applicant => applicant.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    job.applicants.unshift({ user: req.user.id });
    await job.save();

    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};