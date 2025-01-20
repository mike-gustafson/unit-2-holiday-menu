const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');
const { ensureAuthenticated } = require('../utils/middleware/auth');

router.get(   '/',         ensureAuthenticated, controller.getEvents);
router.get(   '/new',      ensureAuthenticated, controller.newEventForm);
router.post(  '/',         ensureAuthenticated, controller.createEvent);
router.put(  '/:eventId/add/:userId', ensureAuthenticated, controller.inviteUser);
router.put(  '/:eventId/remove/:userId', ensureAuthenticated, controller.uninviteUser);
router.get(   '/:id',                           controller.showEvent);
router.get(   '/:id/edit', ensureAuthenticated, controller.editEventForm);
router.put(   '/:id',      ensureAuthenticated, controller.updateEvent);
router.put(   '/:id/rsvp', ensureAuthenticated, controller.rsvp);
router.delete('/:id',      ensureAuthenticated, controller.deleteEvent);

module.exports = router;
