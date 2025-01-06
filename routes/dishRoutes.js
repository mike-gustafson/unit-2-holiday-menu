const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', dishController.getDishes);
router.get('/new', ensureAuthenticated, dishController.newDishForm);
router.get('/:id', dishController.showDish);
router.post('/', ensureAuthenticated, dishController.createDish);
router.get('/:id/edit', ensureAuthenticated, dishController.editDishForm);
router.put('/:id', ensureAuthenticated, dishController.updateDish);
router.delete('/:id', ensureAuthenticated, dishController.deleteDish);

module.exports = router;
