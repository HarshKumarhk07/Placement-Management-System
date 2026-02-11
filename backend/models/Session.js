const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        index: true // Hashed token
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String, // Browser/Device details
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete documents after expiry
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
