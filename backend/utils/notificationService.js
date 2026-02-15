const Notification = require('../models/Notification');
const User = require('../models/User');

const notifyAllStudents = async (type, title, message, relatedJob, eligibleCourses, minCgpa) => {
    try {
        let query = { role: 'student' };

        // 1. Course Filter (Regex for case-insensitive match)
        if (eligibleCourses && eligibleCourses.length > 0) {
            // Escape special characters in course names to prevent regex errors
            const escapedCourses = eligibleCourses.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const courseRegexes = escapedCourses.map(c => new RegExp(`^${c}$`, 'i'));
            query['profile.course'] = { $in: courseRegexes };
        }

        // Fetch students
        const students = await User.find(query).select('_id profile.cgpa');

        // 2. CGPA Filter (JS Logic)
        const cleanCgpa = (val) => parseFloat(String(val || 0)) || 0;
        const requiredCgpa = cleanCgpa(minCgpa);

        const eligibleStudents = students.filter(student => {
            return cleanCgpa(student.profile?.cgpa) >= requiredCgpa;
        });

        if (eligibleStudents.length === 0) return 0;

        // Bulk Insert
        const notifications = eligibleStudents.map(student => ({
            userId: student._id,
            type,
            title,
            message,
            relatedJob,
            isRead: false
        }));

        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} notifications for job: ${title}`);
        return notifications.length;

    } catch (error) {
        console.error('Notification Error:', error);
        return 0; // Return 0 instead of throwing to prevent blocking the main flow
    }
};

module.exports = { notifyAllStudents };
