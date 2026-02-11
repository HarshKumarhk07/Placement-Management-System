const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// Strict Limiter for Auth Routes (Login/Register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Relaxed for dashboard load stability
    message: { message: 'Too many login attempts, please try again after 15 minutes' },
    handler: (req, res, next, options) => {
        logger.warn(`Auth Rate Limit Exceeded: IP ${req.ip}`);
        res.status(options.statusCode).json(options.message); // Ensure JSON response
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests
    message: { message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
