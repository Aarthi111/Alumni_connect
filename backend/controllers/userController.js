const User = require('../models/User')

// Get own profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Update own profile
const updateProfile = async (req, res) => {
  const { name, bio, phone, department, batch, company, linkedIn, profilePicture } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, phone, department, batch, company, linkedIn, profilePicture },
      { new: true }
    ).select('-password -otp -otpExpiry')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getProfile, updateProfile }