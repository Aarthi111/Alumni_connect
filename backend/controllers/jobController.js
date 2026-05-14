const Job = require('../models/Job')

// Alumni posts job
const createJob = async (req, res) => {
  const { title, company, location, jobType, description, salary, lastDate, applyLink } = req.body
  try {
    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      description,
      salary,
      lastDate,
      applyLink,
      postedBy: req.user.id
    })
    res.status(201).json(job)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Students view approved jobs
const getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' })
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Alumni views own jobs
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin views pending jobs
const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin approves job
const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    res.json({ message: 'Job approved', job })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin rejects job
const rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    res.json({ message: 'Job rejected', job })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete job
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id)
    res.json({ message: 'Job deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createJob,
  getApprovedJobs,
  getMyJobs,
  getPendingJobs,
  approveJob,
  rejectJob,
  deleteJob
}