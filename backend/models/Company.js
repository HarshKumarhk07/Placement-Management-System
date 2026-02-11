const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    logo: {
        type: String, // Cloudinary URL
    },
    // New Fields for Enterprise SaaS
    email: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined to be unique (if email is optional initially)
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
