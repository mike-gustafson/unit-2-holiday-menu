const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/new', ensureAuthenticated, eventController.newEventForm);
router.post('/', ensureAuthenticated, eventController.createEvent);
router.get('/:id/edit', ensureAuthenticated, eventController.editEventForm);
router.put('/:id', ensureAuthenticated, eventController.updateEvent);
router.delete('/:id', ensureAuthenticated, eventController.deleteEvent);
router.get('/:id/join', ensureAuthenticated, eventController.attendEvent);
router.get('/:id/leave', ensureAuthenticated, eventController.unattendEvent);
module.exports = router;
