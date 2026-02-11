const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        const selectedApplications = await Application.countDocuments({ status: 'selected' });
        const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

        res.json({
            totalStudents,
            totalCompanies,
            totalJobs,
            totalApplications,
            selectedApplications,
            rejectedApplications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
