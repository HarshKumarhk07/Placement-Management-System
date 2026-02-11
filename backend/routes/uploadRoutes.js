const express = require('express');
const router = express.Router();
const parser = require('../utils/cloudinaryConfig');

router.post('/upload', parser.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
        secure_url: req.file.path,
        public_id: req.file.filename,
    });
});

module.exports = router;
