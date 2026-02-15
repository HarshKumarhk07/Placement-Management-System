const Company = require('../models/Company');

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    const { name, location, website, logo, email } = req.body;

    try {
        const companyExists = await Company.findOne({ name });

        if (companyExists) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const company = await Company.create({
            name,
            location,
            website,
            website,
            logo,
            email,
        });

        res.status(201).json({
            success: true,
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private (Admin/Recruiter) or Public? Protected for now.
const getCompanies = async (req, res) => {
    console.log('Fetching companies, filtering isDeleted: false');
    try {
        const companies = await Company.find({ isDeleted: false })
            .sort({ name: 1 })
            .collation({ locale: 'en', strength: 2 });
        res.json({
            success: true,
            data: companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json({
                success: true,
                data: company
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        await company.deleteOne();

        res.json({ success: true, message: 'Company removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createCompany, getCompanies, getCompanyById, deleteCompany };
