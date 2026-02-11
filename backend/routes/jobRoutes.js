const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getJobsByCompany } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin'), createJob)
    .get(getJobs);

router.route('/:id')
    .get(getJobById);

router.route('/company/:companyId')
    .get(protect, getJobsByCompany);

module.exports = router;
