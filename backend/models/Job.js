const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Internship'],
    required: true
  },
  description: { type: String, required: true },
  salary: { type: String, default: 'Not disclosed' },
  lastDate: { type: Date, required: true },
  applyLink: { type: String },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)