const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginUser,
    refreshSession,
    logoutUser,
    getMe,
    createUser,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.post('/refresh', refreshSession); // New
router.post('/logout', logoutUser); // New
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/create-user', protect, authorize('admin'), createUser);

module.exports = router;
