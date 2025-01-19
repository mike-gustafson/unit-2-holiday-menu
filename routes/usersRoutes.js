const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const { ensureAuthenticated } = require('../utils/middleware/auth');

router.get( '/',                                controller.main);
router.get( '/:id',        ensureAuthenticated, controller.showUser);
router.post('/:id/add',    ensureAuthenticated, controller.addConnection);
router.post('/:id/remove', ensureAuthenticated, controller.removeConnection);

module.exports = router;