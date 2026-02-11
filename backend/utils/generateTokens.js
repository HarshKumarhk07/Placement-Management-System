const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
        // Fallback for dev if not set, but ideally throws
        console.warn('REFRESH_TOKEN_SECRET not set, using JWT_SECRET');
    }

    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Long-lived
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, {
        expiresIn: '90d', // Very Long-lived
    });

    return { accessToken, refreshToken };
};

module.exports = generateTokens;
