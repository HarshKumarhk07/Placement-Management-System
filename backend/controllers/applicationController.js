const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Student
const applyForJob = async (req, res) => {
    const { jobId, resumeUrl } = req.body;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const applicationExists = await Application.findOne({
            job: jobId,
            student: req.user._id,
        });

        if (applicationExists) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            student: req.user._id,
            resumeUrl: resumeUrl || req.user.profile.resumeUrl,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications
// @route   GET /api/applications/my-applications
// @access  Private/Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('job', 'title company status')
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Admin/Recruiter)
const getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('student', 'name email phone profile');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
const updateApplicationStatus = async (req, res) => {
    const { status, interviewStatus, rounds, recruiterNote, rating } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || application.status;
        application.interviewStatus = interviewStatus || application.interviewStatus;
        application.rounds = rounds || application.rounds;
        application.recruiterNote = recruiterNote || application.recruiterNote;
        application.rating = rating || application.rating;

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
