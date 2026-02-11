const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    logo: {
        type: String, // Cloudinary URL
    },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
