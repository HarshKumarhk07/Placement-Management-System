const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'on_hold'],
        default: 'applied',
    },
    interviewStatus: {
        type: String,
        enum: ['pending', 'present', 'absent'],
        default: 'pending',
    },
    rounds: [{
        name: String, // e.g., "Round 1", "HR Round"
        status: {
            type: String,
            enum: ['pending', 'cleared', 'rejected'],
            default: 'pending'
        },
        feedback: String,
        date: Date,
    }],
    recruiterNote: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    resumeUrl: {
        type: String, // Snapshot of resume at time of application
        required: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
