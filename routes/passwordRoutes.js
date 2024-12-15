const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

router.get('/', passwordController.requestForm);
router.post('/', passwordController.createResetToken);
router.get('/:token', passwordController.resetForm);
router.post('/:token', passwordController.resetPassword);

module.exports = router