const express = require('express');
const router = express.Router();
const accountCtlr = require('../controllers/accountCtlr');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/',                                 accountCtlr.home);
router.get('/new',         ensureAuthenticated, accountCtlr.newForm);
router.get('/edit',        ensureAuthenticated, accountCtlr.editForm);
router.get('/delete',      ensureAuthenticated, accountCtlr.deleteConfirm);
router.get('/profile',     ensureAuthenticated, accountCtlr.profile);
router.get('/connections', ensureAuthenticated, accountCtlr.connections);
router.post('/addFavorite', ensureAuthenticated, accountCtlr.addFavorite);
router.post('/removeFavorite', ensureAuthenticated, accountCtlr.removeFavorite);
router.delete('/:id',      ensureAuthenticated, accountCtlr.delete);

module.exports = router;