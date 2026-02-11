const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT']
    },
    resource: {
        type: String,
        required: true // e.g., 'Company', 'Application', 'Job'
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'resource'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: Object // Flexible field for changed values or metadata
    },
    ip: String,
    userAgent: String
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
