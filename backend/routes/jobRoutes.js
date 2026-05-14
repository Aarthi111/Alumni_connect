const express = require('express')
const router = express.Router()
const {
  createJob,
  getApprovedJobs,
  getMyJobs,
  getPendingJobs,
  approveJob,
  rejectJob,
  deleteJob
} = require('../controllers/jobController')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')

// Alumni posts job
router.post('/', protect, authorizeRoles('alumni'), createJob)

// Students view approved jobs
router.get('/', protect, authorizeRoles('student'), getApprovedJobs)

// Alumni views own jobs
router.get('/myjobs', protect, authorizeRoles('alumni'), getMyJobs)

// Admin views pending jobs
router.get('/pending', protect, authorizeRoles('admin'), getPendingJobs)

// Admin approves/rejects
router.put('/:id/approve', protect, authorizeRoles('admin'), approveJob)
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectJob)

// Delete job
router.delete('/:id', protect, authorizeRoles('alumni', 'admin'), deleteJob)

module.exports = router