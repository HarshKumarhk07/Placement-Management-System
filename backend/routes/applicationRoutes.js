const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), applyForJob);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('admin', 'recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('admin', 'recruiter'), updateApplicationStatus);

module.exports = router;
