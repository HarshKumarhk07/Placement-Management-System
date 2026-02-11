const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('Admin user already exists');
            console.log('Email:', adminExists.email);
            // We cannot show password as it is hashed
        } else {
            const admin = await User.create({
                name: 'Super Admin',
                email: 'admin@avani.com',
                password: 'admin123',
                role: 'admin',
                phone: '9999999999'
            });
            console.log('Admin created successfully');
            console.log('Email: admin@avani.com');
            console.log('Password: admin123');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
