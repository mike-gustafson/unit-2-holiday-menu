const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwordController');

router.get( '/',       controller.requestForm);
router.get( '/:token', controller.resetForm);
router.post('/',       controller.createResetToken);
router.post('/:token', controller.resetPassword);

module.exports = router