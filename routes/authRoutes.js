const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.get( '/signup',                controller.signupForm);
router.post('/signup',                controller.signup);
router.post('/login',                 controller.login);
router.post('/logout',                controller.logout);
router.get( '/password/reset',        controller.requestPasswordResetForm);
router.post('/password/reset',        controller.sendPasswordResetEmail);
router.get( '/password/reset/:token', controller.setNewPasswordForm);
router.post('/password/reset/:token', controller.setNewPassword);

// Future routes:
// verify new accounts email:
// router.get('/verifyEmail/:token', controller.verifyEmail); // Handle email verification
// router.post('/verifyEmail/resend', controller.resendVerificationEmail); 
// lock/unlock accounts from too many failed login attempts:
// router.post('/lockAccount', controller.requestLockAccount); // Request account lock
// router.post('/unlockAccount', controller.requestUnlockAccount); // Request account unlock
// router.post('/unlockAccount/:token', controller.unlockAccount); // Unlock account with token

module.exports = router;