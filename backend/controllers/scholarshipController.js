const Scholarship = require('../models/Scholarship')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Admin creates scholarship
const createScholarship = async (req, res) => {
  const { title, description, targetAmount, deadline, department, eligibility } = req.body
  try {
    const scholarship = await Scholarship.create({
      title,
      description,
      targetAmount,
      deadline,
      department,
      eligibility,
      postedBy: req.user.id
    })
    res.status(201).json(scholarship)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all scholarships — alumni and admin only
const getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
    res.json(scholarships)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get single scholarship
const getScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate('postedBy', 'name')
      .populate('donations.donor', 'name email')
    res.json(scholarship)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Create Razorpay order — alumni donates
const createDonationOrder = async (req, res) => {
  const { amount } = req.body
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    })
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Verify payment and save donation
const verifyDonation = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, scholarshipId, amount } = req.body
  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const scholarship = await Scholarship.findById(scholarshipId)
    scholarship.donations.push({
      donor: req.user.id,
      amount: Number(amount),
      paymentId: razorpay_payment_id
    })
    scholarship.totalDonated += Number(amount)
    await scholarship.save()

    res.json({ message: 'Donation successful' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin views all donations for a scholarship
const getDonations = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate('donations.donor', 'name email')
    res.json({
      title: scholarship.title,
      targetAmount: scholarship.targetAmount,
      totalDonated: scholarship.totalDonated,
      percentage: Math.round((scholarship.totalDonated / scholarship.targetAmount) * 100),
      donations: scholarship.donations
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin deletes scholarship
const deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id)
    res.json({ message: 'Scholarship deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createScholarship,
  getScholarships,
  getScholarship,
  createDonationOrder,
  verifyDonation,
  getDonations,
  deleteScholarship
}