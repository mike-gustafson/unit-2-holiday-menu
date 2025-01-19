const express = require('express');
const router = express.Router();
const controller = require('../controllers/dishController');
const { ensureAuthenticated } = require('../utils/middleware/auth');

router.get('/',         ensureAuthenticated, controller.getDishes);
router.get('/new',      ensureAuthenticated, controller.newDishForm);
router.get('/:id',      ensureAuthenticated, controller.showDish);
router.post('/',        ensureAuthenticated, controller.createDish);
router.get('/:id/edit', ensureAuthenticated, controller.editDishForm);
router.put('/:id',      ensureAuthenticated, controller.updateDish);
router.delete('/:id',   ensureAuthenticated, controller.deleteDish);

module.exports = router;
