const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.get( '/',      controller.main);
router.get( '/:id',   controller.showUser);

module.exports = router;