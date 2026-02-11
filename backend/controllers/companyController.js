const Company = require('../models/Company');

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    const { name, location, website, logo } = req.body;

    try {
        const companyExists = await Company.findOne({ name });

        if (companyExists) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const company = await Company.create({
            name,
            location,
            website,
            logo,
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private (Admin/Recruiter) or Public? Protected for now.
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCompany, getCompanies, getCompanyById };
