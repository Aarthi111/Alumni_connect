const express = require('express')
const router = express.Router()
const {
  createScholarship,
  getScholarships,
  getScholarship,
  createDonationOrder,
  verifyDonation,
  getDonations,
  deleteScholarship
} = require('../controllers/scholarshipController')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')

// Admin creates scholarship
router.post('/', protect, authorizeRoles('admin'), createScholarship)

// Alumni and admin view scholarships
router.get('/', protect, authorizeRoles('alumni', 'admin'), getScholarships)

// Single scholarship
router.get('/:id', protect, authorizeRoles('alumni', 'admin'), getScholarship)

// Alumni donates
router.post('/:id/donate/order', protect, authorizeRoles('alumni'), createDonationOrder)
router.post('/:id/donate/verify', protect, authorizeRoles('alumni'), verifyDonation)

// Admin views donations
router.get('/:id/donations', protect, authorizeRoles('admin'), getDonations)

// Admin deletes
router.delete('/:id', protect, authorizeRoles('admin'), deleteScholarship)

module.exports = router