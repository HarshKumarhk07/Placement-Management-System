const express = require('express');
const router = express.Router();
const { registerStudent, loginUser, getMe, createUser, updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile); // Add this
router.post('/create-user', protect, authorize('admin'), createUser);

module.exports = router;
