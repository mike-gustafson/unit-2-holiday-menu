const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, itemController.getItems);
router.get('/new', ensureAuthenticated, itemController.newItemForm);
router.post('/', ensureAuthenticated, itemController.createItem);
router.get('/:id/edit', ensureAuthenticated, itemController.editItemForm);
router.put('/:id', ensureAuthenticated, itemController.updateItem);
router.delete('/:id', ensureAuthenticated, itemController.deleteItem);

module.exports = router;
