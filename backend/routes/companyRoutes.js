const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompanyById } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin'), createCompany)
    .get(protect, getCompanies);

router.route('/:id')
    .get(protect, getCompanyById);

module.exports = router;
