const User = require('../models/User');
const Session = require('../models/Session');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

// Helper to set cookie
const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
    const { name, email, password, phone, course, college, year, skills } = req.body;

    try {
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Gmail-only validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid Gmail address' });
        }

        // India phone format validation (10 digits, starts with 6-9)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian phone number' });
        }

        // Manual check for friendly error messages
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email address already exists' });
        }

        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ success: false, message: 'Phone number already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'student',
            profile: { course, college, year, skills: skills || [] },
        });

        if (user) {
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Store refresh token in DB
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            // Create Session for tracking
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 90);

            await Session.create({
                user: user._id,
                refreshToken,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                expiresAt
            });

            setRefreshTokenCookie(res, refreshToken);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken,
                }
            });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Update user session/audit
            user.refreshToken = refreshToken;
            user.lastLoginIp = req.ip;
            await user.save({ validateBeforeSave: false });

            // Create Session
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 90);

            await Session.create({
                user: user._id,
                refreshToken,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                expiresAt
            });

            setRefreshTokenCookie(res, refreshToken);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken,
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Cookie)
const refreshSession = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);

        // Find user and verify token in DB
        const user = await User.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        // Find valid session
        const session = await Session.findOne({ refreshToken, isValid: true });
        if (!session) {
            return res.status(403).json({ success: false, message: 'Session expired' });
        }

        // Rotate Tokens
        const tokens = generateTokens(user._id);
        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        // Update Session
        session.refreshToken = tokens.refreshToken;
        await session.save();

        setRefreshTokenCookie(res, tokens.refreshToken);

        res.json({
            success: true,
            message: 'Token refreshed',
            data: { accessToken: tokens.accessToken }
        });
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Refresh failed' });
    }
};

// @desc    Logout user / Revoke Session
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        // Invalidate in DB
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        await Session.findOneAndUpdate({ refreshToken }, { isValid: false });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

// @desc    Create a user (Admin only - for Recruiters/Company)
// @route   POST /api/auth/create-user
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, companyId, designation } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const user = await User.create({
            name, email, password, role,
            profile: { companyId, designation },
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.profile = { ...user.profile, ...req.body };
        const updatedUser = await user.save();
        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile,
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

module.exports = {
    registerStudent,
    loginUser,
    refreshSession,
    logoutUser,
    getMe,
    createUser,
    updateProfile
};

