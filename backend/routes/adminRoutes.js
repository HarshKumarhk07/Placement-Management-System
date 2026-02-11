const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    createCompany,
    deleteCompany,
    createDrive,
    updateDriveStatus,
    getAllApplications,
    updateApplicationStatus,
    exportApplicationsToCSV,
    getAuditLogs,
    getAllStudents,
    deleteStudent
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);

// Company Management
router.post('/company', createCompany);
router.delete('/company/:id', deleteCompany);

// Drive Management
router.post('/drives', createDrive);
router.put('/drive/:id/status', updateDriveStatus);

// Application Management
router.get('/applications', getAllApplications);
router.get('/export/applications', exportApplicationsToCSV); // New
router.put('/application/:id/status', updateApplicationStatus);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Student Management
router.get('/students', getAllStudents);
router.delete('/student/:id', deleteStudent);

module.exports = router;
