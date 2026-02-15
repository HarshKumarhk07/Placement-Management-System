const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Company = require('./models/Company');

// Ensure correct path to .env
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });
console.log('Loading .env from:', envPath);

const debugLinkage = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('\n--- Recruiters ---');
        const recruiters = await User.find({ role: 'recruiter' }).select('+password');
        if (recruiters.length === 0) {
            console.log('No recruiters found.');
        } else {
            recruiters.forEach(r => {
                console.log(`ID: ${r._id}, Name: ${r.name}, Email: ${r.email}, CompanyID: ${r.profile?.companyId || 'NONE'}`);
            });
        }

        console.log('\n--- Companies ---');
        const companies = await Company.find({});
        if (companies.length === 0) {
            console.log('No companies found.');
        } else {
            companies.forEach(c => {
                console.log(`ID: ${c._id}, Name: ${c.name}, Email: ${c.email || 'NONE'}, Recruiter: ${c.recruiter || 'NONE'}`);
            });
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLinkage();
