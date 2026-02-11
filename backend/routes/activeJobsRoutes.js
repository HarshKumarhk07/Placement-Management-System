const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @desc    Get active jobs (for students)
// @route   GET /api/active-jobs
// @access  Public
router.get('/', async (req, res) => {
    console.log('✅ Active jobs endpoint called');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const jobs = await Job.find({
            status: 'Active',
            deadline: { $gte: today },
            isDeleted: false
        })
            .populate('company', 'name logo location website')
            .sort({ deadline: 1 });

        res.json({
            success: true,
            message: `Found ${jobs.length} active placement drives`,
            data: jobs
        });
    } catch (error) {
        console.error('Error fetching active jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active drives',
            error: error.message
        });
    }
});

module.exports = router;
