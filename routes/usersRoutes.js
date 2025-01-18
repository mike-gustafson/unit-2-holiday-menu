const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.get( '/',           controller.main);
router.get( '/:id',        controller.showUser);
router.post('/:id/add',    controller.addConnection);
router.post('/:id/remove', controller.removeConnection);

module.exports = router;