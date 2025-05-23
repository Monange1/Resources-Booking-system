const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Login route (accessible to all users)
router.post('/login', loginUser);

module.exports = router;
