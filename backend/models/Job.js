const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    title: {
        type: String, // e.g., "Web Developer"
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String, // Required qualifications
        required: true,
    },
    vacancies: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    package: {
        type: String, // e.g., "5-8 LPA"
    },
    minCGPA: {
        type: Number,
        default: 0,
        required: true
    },
    deadline: {
        type: Date,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who created the drive
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Expired'],
        default: 'Active',
        index: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    eligibleCourses: {
        type: [String], // Array of strings, e.g., ["B.Tech", "MCA"]
        required: true,
        default: []
    }
}, { timestamps: true });

// Compound Index for efficient filtering
jobSchema.index({ status: 1, deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
