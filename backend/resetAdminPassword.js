const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admin = await User.findOne({ email: 'admin@avani.com' });

        if (admin) {
            admin.password = 'admin123'; // The pre-save hook will hash this
            await admin.save();
            console.log('Admin password reset to: admin123');
        } else {
            console.log('Admin user not found, creating one...');
            await User.create({
                name: 'Super Admin',
                email: 'admin@avani.com',
                password: 'admin123',
                role: 'admin',
                phone: '9999999999'
            });
            console.log('Admin user created with password: admin123');
        }

        process.exit();
    } catch (error) {
        console.error('Error resetting admin password:', error);
        process.exit(1);
    }
};

resetAdmin();
