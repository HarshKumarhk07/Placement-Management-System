const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, text, html) => {
    try {
        // Create transporter (Configured for local dev/testing - update with real SMTP for prod)
        // Using Ethereal for testing or Gmail if configured in .env
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Placement Portal" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Email Failed: ${error.message}`);
        // Don't throw to avoid blocking the main request
        return null;
    }
};

module.exports = sendEmail;
