const Application = require('../models/Application');
const Job = require('../models/Job');
const logActivity = require('../utils/auditLogger');
const sendEmail = require('../utils/sendEmail');
const logger = require('../config/logger');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Student
const applyForJob = async (req, res) => {
    const { jobId } = req.body;

    try {
        // Fetch student profile to get resume
        const User = require('../models/User');
        const student = await User.findById(req.user._id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Validate resume exists in profile
        if (!student.profile?.resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please upload resume in profile before applying'
            });
        }

        // Validate job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check for duplicate application
        const applicationExists = await Application.findOne({
            job: jobId,
            student: req.user._id,
        });

        if (applicationExists) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Create application with resume from profile
        const application = await Application.create({
            job: jobId,
            student: req.user._id,
            resumeUrl: student.profile.resumeUrl,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        logger.error(`Apply Job Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting application'
        });
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
        res.json({
            success: true,
            data: applications
        });
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
        res.json({
            success: true,
            data: applications
        });
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
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const oldStatus = application.status;
        application.status = status || application.status;
        application.interviewStatus = interviewStatus || application.interviewStatus;
        application.rounds = rounds || application.rounds;
        application.recruiterNote = recruiterNote || application.recruiterNote;
        application.rating = rating || application.rating;

        application.updatedBy = req.user._id;
        await application.save();

        // Log Activity
        await logActivity(req, 'UPDATE', 'Application', application._id, {
            oldStatus,
            newStatus: application.status,
            source: 'ApplicationController'
        });

        // Send Email if status changed to critical state
        if (status && status !== oldStatus && ['Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Released'].includes(status)) {
            // We need to populate student and job for the email template
            const populatedApp = await Application.findById(application._id)
                .populate('student', 'name email')
                .populate({
                    path: 'job',
                    populate: { path: 'company', select: 'name' }
                });

            const subject = `Update on your application for ${populatedApp.job?.title} at ${populatedApp.job?.company?.name}`;
            const text = `Hi ${populatedApp.student?.name},\n\nYour application status has been updated to: ${status}.\n\nLog in to the portal for more details.`;
            const html = `<h3>Application Status Update</h3><p>Hi <b>${populatedApp.student?.name}</b>,</p><p>Your application for <b>${populatedApp.job?.title}</b> at <b>${populatedApp.job?.company?.name}</b> has been updated to: <span style="color: green; font-weight: bold;">${status}</span>.</p><p>Please log in to the student portal to take the next steps.</p><br><p>Best Regards,<br>Placement Cell</p>`;

            await sendEmail(populatedApp.student?.email, subject, text, html);
        }
        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
