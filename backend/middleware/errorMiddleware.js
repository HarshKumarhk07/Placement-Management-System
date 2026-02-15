const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    // Log the error with Winston
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // Only log stack trace in development or for 500 errors
    if (process.env.NODE_ENV !== 'production' || statusCode === 500) {
        logger.error(err.stack);
    }

    res.status(statusCode);

    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
