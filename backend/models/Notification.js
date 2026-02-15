const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['new_drive', 'application_status', 'system', 'interview_scheduled'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
