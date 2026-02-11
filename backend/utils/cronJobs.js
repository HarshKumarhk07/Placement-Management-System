const cron = require('node-cron');
const Job = require('../models/Job');
const logger = require('../config/logger');

const startCronJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        logger.info('Running Cron Job: Auto-Close Expired Drives');
        try {
            const now = new Date();
            const result = await Job.updateMany(
                {
                    deadline: { $lt: now },
                    status: 'Active',
                    isDeleted: false
                },
                { status: 'Expired' }
            );

            if (result.modifiedCount > 0) {
                logger.info(`Expired ${result.modifiedCount} drives.`);
            }
        } catch (error) {
            logger.error(`Cron Job Failed: ${error.message}`);
        }
    });
};

module.exports = startCronJobs;
