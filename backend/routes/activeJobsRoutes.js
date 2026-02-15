const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @desc    Get active jobs (for students)
// @route   GET /api/active-jobs
// @access  Public
const { protect } = require('../middleware/authMiddleware'); // Import protect
const User = require('../models/User'); // Import User

// @desc    Get active jobs (Smart Filtered for Student)
// @route   GET /api/active-jobs
// @access  Private (Student)
router.get('/', protect, async (req, res) => {
    console.log(`✅ Active jobs endpoint called by user: ${req.user.name} (${req.user.email})`);
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Get raw active jobs
        const jobs = await Job.find({
            status: 'Active',
            deadline: { $gte: today },
            isDeleted: false
        })
            .populate('company', 'name logo location website')
            .sort({ deadline: 1 })
            .lean(); // Use lean() for better performance

        // 2. Get full student profile to check eligibility
        const student = await User.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const studentCGPA = parseFloat(student.profile?.academics?.cgpa || 0);
        const studentCourse = student.profile?.course;

        // 3. Smart Filtering (Course & CGPA)
        const eligibleJobs = jobs.filter(job => {
            // Check CGPA
            const minCGPA = job.minCGPA || 0;
            if (studentCGPA < minCGPA) return false;

            // Check Course
            const eligibleCourses = job.eligibleCourses || [];
            if (eligibleCourses.length > 0) {
                // If job has restrictions, student must match
                if (!studentCourse || !eligibleCourses.includes(studentCourse)) {
                    return false;
                }
            }

            return true;
        });

        console.log(`🔍 Filtered ${jobs.length} jobs down to ${eligibleJobs.length} eligible jobs.`);

        res.json({
            success: true,
            message: `Found ${eligibleJobs.length} active placement drives for you`,
            data: eligibleJobs
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
