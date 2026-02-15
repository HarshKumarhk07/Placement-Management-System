const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog'); // New
const logActivity = require('../utils/auditLogger'); // New
const logger = require('../config/logger');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student', isDeleted: false });
        const totalCompanies = await Company.countDocuments({ isDeleted: false });
        const totalDrives = await Job.countDocuments({ isDeleted: false });
        const activeDrives = await Job.countDocuments({ status: 'Active', isDeleted: false });
        const totalApplications = await Application.countDocuments({ isDeleted: false });

        const selectedCandidates = await Application.countDocuments({
            status: { $in: ['Selected', 'Offer Released'] },
            isDeleted: false
        });

        // Aggregation for Placement Trends (Last 6 Months)
        const placementTrends = await Application.aggregate([
            {
                $match: {
                    status: { $in: ['Selected', 'Offer Released'] },
                    isDeleted: false,
                    updatedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$updatedAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                totalCompanies,
                totalDrives,
                activeDrives,
                totalApplications,
                selectedCandidates,
                placementTrends
            }
        });
    } catch (error) {
        logger.error(`Admin Stats Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
};

// @desc    Create Company + Recruiter (Transaction)
// @route   POST /api/admin/company
const createCompany = async (req, res) => {
    const { companyName, location, website, recruiterName, recruiterEmail, recruiterPassword } = req.body;

    try {
        // 1. Create Company
        const company = await Company.create({
            name: companyName,
            location,
            website,
            email: recruiterEmail, // Company Contact
            createdBy: req.user._id
        });

        // 2. Create Recruiter
        const recruiter = await User.create({
            name: recruiterName,
            email: recruiterEmail,
            password: recruiterPassword,
            role: 'recruiter',
            profile: {
                companyId: company._id,
                designation: 'HR Manager'
            },
            createdBy: req.user._id
        });

        // 3. Link Recruiter to Company
        company.recruiter = recruiter._id;
        await company.save();

        await logActivity(req, 'CREATE', 'Company', company._id, { name: company.name });

        logger.info(`Company ${company.name} created with Recruiter ${recruiter.email} by Admin ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Company and Recruiter created successfully',
            data: { company, recruiter }
        });
    } catch (error) {
        logger.error(`Create Company Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Soft Delete Company
// @route   DELETE /api/admin/company/:id
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        // Hard delete associated Recruiter
        if (company.recruiter) {
            await User.findByIdAndDelete(company.recruiter);
        }

        await logActivity(req, 'DELETE', 'Company', company._id, { name: company.name });

        res.json({
            success: true,
            message: 'Company and Recruiter deleted permanently'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create Drive
// @route   POST /api/admin/drives
const createDrive = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id
        });

        const company = await Company.findById(req.body.company);
        await logActivity(req, 'CREATE', 'Job', job._id, {
            title: job.title,
            companyName: company?.name
        });

        res.status(201).json({
            success: true,
            message: 'Placement drive created successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get All Applications (Filtered & Search)
// @route   GET /api/admin/applications
const getAllApplications = async (req, res) => {
    try {
        const { status, company, search } = req.query;
        let query = { isDeleted: false };

        if (status) query.status = status;

        // Complex filtering if company ID is provided
        if (company) {
            // This assumes company is passed as ID. If name, we need to look up company first or use aggregation.
            // For now, let's assume filtering by company ID if provided.
            // If we want to filter by company NAME from a dropdown that sends IDs, this works.
            // If we want to search company name, we need aggregate.
        }

        let applications = await Application.find(query)
            .populate('student', 'name email profile.college')
            .populate({
                path: 'job',
                select: 'title company',
                populate: { path: 'company', select: 'name' }
            })
            .sort({ createdAt: -1 });

        // Post-fetch filtering for Search (Simplest for now without complex Aggregation lookups)
        // Check if there is a search term
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            applications = applications.filter(app =>
                (app.student?.name && searchRegex.test(app.student.name)) ||
                (app.student?.email && searchRegex.test(app.student.email)) ||
                (app.job?.company?.name && searchRegex.test(app.job.company.name)) ||
                (app.job?.title && searchRegex.test(app.job.title))
            );
        }

        // Filter by Company ID if passed (and not handled in query because it's deep)
        // actually company filter on Application model is not direct, it's via Job.
        // So we filter here too.
        if (company) {
            applications = applications.filter(app =>
                app.job?.company?._id.toString() === company ||
                app.job?.company?.name === company // Handle name fallback
            );
        }

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const sendEmail = require('../utils/sendEmail'); // New

// @desc    Update Application Status
// @route   PUT /api/admin/application/:id/status
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            });

        if (!application) return res.status(404).json({ message: 'Application not found' });

        const oldStatus = application.status;
        application.status = status;
        application.updatedBy = req.user._id;
        await application.save();

        await logActivity(req, 'UPDATE', 'Application', application._id, {
            oldStatus,
            newStatus: status,
            studentId: application.student?._id,
            studentName: application.student?.name
        });

        // Trigger Email Notification for critical status changes
        if (['Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Released'].includes(status)) {
            const subject = `Update on your application for ${application.job?.title} at ${application.job?.company?.name}`;
            const text = `Hi ${application.student?.name},\n\nYour application status has been updated to: ${status}.\n\nLog in to the portal for more details.`;
            const html = `<h3>Application Status Update</h3><p>Hi <b>${application.student?.name}</b>,</p><p>Your application for <b>${application.job?.title}</b> at <b>${application.job?.company?.name}</b> has been updated to: <span style="color: green; font-weight: bold;">${status}</span>.</p><p>Please log in to the student portal to take the next steps.</p><br><p>Best Regards,<br>Placement Cell</p>`;

            try {
                await sendEmail(application.student?.email, subject, text, html);
            } catch (emailError) {
                logger.error(`Failed to send email: ${emailError.message}`);
                // Continue without failing the request
            }
        }

        res.json({
            success: true,
            message: `Status updated to ${status}`,
            data: application
        });
    } catch (error) {
        logger.error(`Update Status Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Export Applications to CSV
// @route   GET /api/admin/export/applications
const exportApplicationsToCSV = async (req, res) => {
    const { Parser } = require('json2csv');
    try {
        await logActivity(req, 'EXPORT', 'Application', null, { format: 'CSV' });

        const applications = await Application.find({ isDeleted: false })
            .populate('student', 'name email profile.college profile.course profile.year')
            .populate({
                path: 'job',
                select: 'title company',
                populate: { path: 'company', select: 'name' }
            })
            .sort({ createdAt: -1 });

        const fields = [
            { label: 'Student Name', value: 'student.name' },
            { label: 'Email', value: 'student.email' },
            { label: 'College', value: 'student.profile.college' },
            { label: 'Course', value: 'student.profile.course' },
            { label: 'Year', value: 'student.profile.year' },
            { label: 'Company', value: 'job.company.name' },
            { label: 'Job Role', value: 'job.title' },
            { label: 'Status', value: 'status' },
            { label: 'Applied At', value: (row) => new Date(row.createdAt).toLocaleDateString() }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(applications);

        res.header('Content-Type', 'text/csv');
        res.attachment('applications_export.csv');
        return res.send(csv);

    } catch (error) {
        logger.error(`Export CSV Error: ${error.message}`);
        res.status(500).json({ message: 'Failed to export CSV' });
    }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get All Students
// @route   GET /api/admin/students
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student', isDeleted: false })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Soft Delete Student
// @route   DELETE /api/admin/student/:id
const deleteStudent = async (req, res) => {
    console.log(`Attempting to delete student: ${req.params.id}`);
    try {
        const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });

        if (!student) {
            console.log(`Student not found or role mismatch: ${req.params.id}`);
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log(`Student ${student.email} deleted permanently.`);

        // Log activity asynchronously
        try {
            await logActivity(req, 'DELETE', 'User', student._id, { name: student.name, role: 'student' });
        } catch (logError) {
            console.error(`Audit Log Fail: ${logError.message}`);
        }

        res.json({
            success: true,
            message: 'Student account deleted permanently'
        });
    } catch (error) {
        console.error(`Error deleting student [FATAL]: ${error.message}`, error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update Drive Status
// @route   PUT /api/admin/drive/:id/status
const updateDriveStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        job.status = status || job.status;
        job.updatedBy = req.user._id;
        await job.save();

        // Re-fetch or populate to get company name for logs
        const updatedJob = await Job.findById(job._id).populate('company', 'name');

        await logActivity(req, 'UPDATE', 'Job', job._id, {
            status: job.status,
            title: updatedJob.title,
            companyName: updatedJob.company?.name
        });

        res.json({
            success: true,
            message: `Drive status updated to ${job.status}`,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Soft Delete Drive
// @route   DELETE /api/admin/drive/:id
const deleteDrive = async (req, res) => {
    try {
        // Need to fetch first to get name for logs if required
        const job = await Job.findById(req.params.id).populate('company', 'name');
        if (!job) return res.status(404).json({ message: 'Drive not found' });

        await Job.findByIdAndDelete(req.params.id);

        await logActivity(req, 'DELETE', 'Job', job._id, {
            title: job.title,
            companyName: job.company?.name
        });

        res.json({ success: true, message: 'Drive deleted permanently' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Soft Delete Application
// @route   DELETE /api/admin/application/:id
const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('student', 'name');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        await Application.findByIdAndDelete(req.params.id);

        await logActivity(req, 'DELETE', 'Application', application._id, {
            studentId: application.student?._id,
            studentName: application.student?.name
        });

        res.json({ success: true, message: 'Application deleted permanently' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    createCompany,
    deleteCompany,
    createDrive,
    updateDriveStatus,
    deleteDrive,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
    exportApplicationsToCSV,
    getAuditLogs,
    getAllStudents,
    deleteStudent
};
