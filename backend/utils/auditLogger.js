const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');

const logActivity = async (req, action, resource, resourceId, details = {}) => {
    try {
        await AuditLog.create({
            action,
            resource,
            resourceId,
            user: req.user._id,
            details,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
    } catch (error) {
        // Don't block the main flow if logging fails, but log the error
        logger.error(`Audit Log Failed: ${error.message}`);
    }
};

module.exports = logActivity;
