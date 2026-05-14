const mongoose = require('mongoose')

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  department: { type: String, required: true },
  eligibility: { type: String },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donations: [{
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    paymentId: { type: String },
    date: { type: Date, default: Date.now }
  }],
  totalDonated: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Scholarship', scholarshipSchema)