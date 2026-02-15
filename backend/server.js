const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

const helmet = require('helmet');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const startCronJobs = require('./utils/cronJobs');

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

dotenv.config();
startCronJobs(); // Initialize Cron

const app = express();
console.log('DEBUG: process.env.PORT is', process.env.PORT);
const PORT = process.env.PORT || 5000;

// Request Logger for Debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const cookieParser = require('cookie-parser');

// 1. CORS Middleware (Must be very early for preflights)
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://placement-management-system-eight.vercel.app' // Fallback/Historical
        ];

        // Check against allowed origins or vercel preview deployments
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 2. Standard Middleware
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(cookieParser()); // Parse Cookie header

// 3. Security Middleware
app.use(helmet());

// 4. Global Rate Limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter); // Stricter limit for auth

// Routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const statsRoutes = require('./routes/statsRoutes'); // Legacy stats?
const adminRoutes = require('./routes/adminRoutes'); // New Enterprise Admin
const uploadRoutes = require('./routes/uploadRoutes');
const activeJobsRoutes = require('./routes/activeJobsRoutes'); // Dedicated active jobs route
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes); // New
app.use('/api/upload', uploadRoutes);
app.use('/api/active-jobs', activeJobsRoutes); // Dedicated active jobs endpoint
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Placement Management System API is running...');
});

// Catch-all for unmatched routes
app.use((req, res, next) => {
    console.log(`404 - Unmatched Route: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error Middleware (Must be last)
app.use(errorHandler);

// Robust Database Connection & Server Start
const startServer = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');

        // Strict Query for Mongoose 7+
        mongoose.set('strictQuery', false);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are default in Mongoose 6+, but good for clarity if using older versions
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB unreachable
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Only start server after DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Monitor Connection Errors after initial connection
mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

startServer();
