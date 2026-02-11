const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getJobsByCompany, getActiveJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Alternative path to avoid any route matching issues
router.get('/list/active', getActiveJobs);

router.get('/company/:companyId', protect, getJobsByCompany);

router.route('/')
    .post(protect, authorize('admin'), createJob)
    .get(getJobs);

router.route('/:id')
    .get(getJobById);

module.exports = router;
