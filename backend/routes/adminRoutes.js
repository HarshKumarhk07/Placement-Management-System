const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    createCompany,
    deleteCompany,
    createDrive,
    updateDriveStatus,
    deleteDrive,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
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
router.delete('/drive/:id', deleteDrive);

// Application Management
router.get('/applications', getAllApplications);
router.get('/export/applications', exportApplicationsToCSV);
router.put('/application/:id/status', updateApplicationStatus);
router.delete('/application/:id', deleteApplication);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Student Management
router.get('/students', getAllStudents);
router.delete('/student/:id', deleteStudent);

module.exports = router;
