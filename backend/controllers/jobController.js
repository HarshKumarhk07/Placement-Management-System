const Job = require('../models/Job');

// @desc    Create a new job (Placement Drive)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    const { company, title, description, requirements, vacancies, location, package, deadline } = req.body;

    try {
        const job = await Job.create({
            company,
            title,
            description,
            requirements,
            vacancies,
            location,
            package,
            deadline,
            postedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('company', 'name logo location');
        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    console.log('🔍 getJobById called with ID:', req.params.id);
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name logo location website');

        if (job) {
            res.json({
                success: true,
                data: job
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get jobs by Company ID
// @route   GET /api/jobs/company/:companyId
// @access  Private (Recruiter)
const getJobsByCompany = async (req, res) => {
    try {
        const jobs = await Job.find({ company: req.params.companyId }).populate('company', 'name');
        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active jobs (for students)
// @route   GET /api/jobs/active
// @access  Public
const getActiveJobs = async (req, res) => {
    console.log('✅ getActiveJobs called - fetching active drives');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const jobs = await Job.find({
            status: 'Active',
            deadline: { $gte: today },
            isDeleted: false
        })
            .populate('company', 'name logo location website')
            .sort({ deadline: 1 }); // Sort by deadline ascending

        res.json({
            success: true,
            message: `Found ${jobs.length} active placement drives`,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active drives'
        });
    }
};

module.exports = { createJob, getJobs, getJobById, getJobsByCompany, getActiveJobs };
