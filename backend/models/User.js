const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'recruiter'],
        default: 'student',
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple nulls if any exist, though here it's fine
        index: true
    },
    profile: {
        // Student specific fields
        course: String,
        college: String,
        year: String,
        skills: [String],
        resumeUrl: String,
        resumePublicId: String, // For Cloudinary deletion

        // Recruiter specific fields
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        designation: String,
    },
    refreshToken: {
        type: String,
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    lastLoginIp: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Compound Index for efficient role-based queries
userSchema.index({ email: 1, role: 1 });

// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    // No need for try-catch here as Mongoose handles promise rejections
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
