const Job = require('../models/Job');

// @desc    Create a new job (Placement Drive)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    const { company, title, description, requirements, vacancies, location, package, minCGPA, deadline, eligibleCourses } = req.body;

    try {
        const job = await Job.create({
            company,
            title,
            description,
            requirements,
            vacancies,
            location,
            package,
            minCGPA: minCGPA || 0,
            deadline,
            eligibleCourses: eligibleCourses || [],
            postedBy: req.user._id,
            status: 'Active'
        });

        // Trigger Notification
        const { notifyAllStudents } = require('../utils/notificationService');
        const notificationTitle = `New Drive: ${job.title}`;
        const notificationMessage = `${job.company} is hiring! Check details.`;

        // Pass eligibility criteria to service
        // Intentionally not awaiting this to avoid blocking the response
        notifyAllStudents(
            'new_drive',
            notificationTitle,
            notificationMessage,
            job._id,
            job.eligibleCourses,
            job.minCGPA
        ).catch(err => console.error('Async Notification Error:', err));

        res.status(201).json({
            success: true,
            data: job,
            message: 'Job posted successfully and notifications queued.'
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
        const jobs = await Job.find({ isDeleted: false }).populate('company', 'name logo location');
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
        const jobs = await Job.find({ company: req.params.companyId, isDeleted: false }).populate('company', 'name');
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

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        await job.deleteOne();

        res.json({ success: true, message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createJob, getJobs, getJobById, getJobsByCompany, getActiveJobs, deleteJob };
