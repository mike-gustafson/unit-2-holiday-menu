const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', accountController.accountHome);
router.get('/new', ensureAuthenticated, accountController.newAccountForm);
router.get('/profile', ensureAuthenticated, accountController.accountProfile);
router.get('/edit', ensureAuthenticated, accountController.editAccountForm);
router.get('/profile/deleteConfirm', ensureAuthenticated, accountController.deleteAccountConfirm);
router.delete('/:id', ensureAuthenticated, accountController.deleteAccount);

module.exports = router;