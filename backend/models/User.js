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
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
