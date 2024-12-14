const express = require('express');
const router = express.Router();
const forgotPasswordcontroller = require('../controllers/forgotPasswordController');

router.get('/', forgotPasswordcontroller.forgotPasswordForm);
router.post('/', forgotPasswordcontroller.forgotPassword);
router.get('/reset/:token', forgotPasswordcontroller.resetPasswordForm);
router.post('/reset/:token', forgotPasswordcontroller.resetPassword);

module.exports = router