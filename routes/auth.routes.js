const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Auth entry points: issue token and fetch logged-in profile.
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
