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
    deadline: {
        type: Date,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who created the drive
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
