const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompanyById, deleteCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin'), createCompany)
    .get(protect, getCompanies);

router.route('/:id')
    .get(protect, getCompanyById)
    .delete(protect, authorize('admin'), deleteCompany);

module.exports = router;
