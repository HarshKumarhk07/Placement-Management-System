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

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('company', 'name logo location');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name logo location website');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get jobs by Company ID
// @route   GET /api/jobs/company/:companyId
// @access  Private (Recruiter)
const getJobsByCompany = async (req, res) => {
    try {
        const jobs = await Job.find({ company: req.params.companyId }).populate('company', 'name');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createJob, getJobs, getJobById, getJobsByCompany };
