const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const AllowedEmail = require('../models/AllowedEmail')

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Register
const register = async (req, res) => {
  const { name, email, password, role, batch, department, company, linkedIn } = req.body

  try {
    // Check whitelist
    const isAllowed = await AllowedEmail.findOne({ email })
    if (!isAllowed) {
      return res.status(400).json({ 
        message: 'Your email is not authorized to register' 
      })
    }

    // Check role matches whitelist role
    if (isAllowed.role !== role) {
      return res.status(400).json({ 
        message: `This email is registered as ${isAllowed.role} not ${role}` 
      })
    }

    // Check if already registered
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry
    }

    // Add alumni specific fields
    if (role === 'alumni') {
      userData.batch = batch
      userData.department = department
      userData.company = company
      userData.linkedIn = linkedIn
      userData.status = 'pending'
    }

    const user = await User.create(userData)

    // Send OTP email
    await sendEmail(email, otp)

    res.status(201).json({
      message: 'Registration successful. Please verify your email with OTP',
      userId: user._id
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Verify OTP
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    if (user.role === 'alumni') {
      return res.json({ message: 'Email verified. Waiting for admin approval' })
    }

    res.json({
      message: 'Email verified successfully',
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' })
    }

    if (user.role === 'alumni' && user.status !== 'approved') {
      return res.status(400).json({ message: 'Your account is pending admin approval' })
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
const otp = generateOTP()
console.log('Generated OTP:', otp) // see OTP in terminal

module.exports = { register, login, verifyOTP }