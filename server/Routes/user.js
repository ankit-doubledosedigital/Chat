const express = require('express');
const authController = require('../controller/user');
const router = express.Router();

router.post('/', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
