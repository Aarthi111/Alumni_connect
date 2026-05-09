const express = require('express')
const router = express.Router()
const AllowedEmail = require('../models/AllowedEmail')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')

// Add email to whitelist
router.post('/allowed-emails', protect, authorizeRoles('admin'), async (req, res) => {
  const { email, role } = req.body
  try {
    const exists = await AllowedEmail.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Email already in whitelist' })
    }
    const allowed = await AllowedEmail.create({ email, role })
    res.status(201).json(allowed)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// View all allowed emails
router.get('/allowed-emails', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const emails = await AllowedEmail.find()
    res.json(emails)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete email from whitelist
router.delete('/allowed-emails/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await AllowedEmail.findByIdAndDelete(req.params.id)
    res.json({ message: 'Email removed from whitelist' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router