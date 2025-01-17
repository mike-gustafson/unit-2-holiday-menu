const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get(   '/',                                    controller.home);
router.get(   '/edit',           ensureAuthenticated, controller.editForm);
router.get(   '/delete',         ensureAuthenticated, controller.deleteConfirm);
router.get(   '/profile',        ensureAuthenticated, controller.profile);
router.get(   '/connections',    ensureAuthenticated, controller.connections);
router.post(  '/addFavorite',    ensureAuthenticated, controller.addFavorite);
router.post(  '/removeFavorite', ensureAuthenticated, controller.removeFavorite);
router.put(   '/update',         ensureAuthenticated, controller.update);
router.delete('/:id',            ensureAuthenticated, controller.delete);

module.exports = router;