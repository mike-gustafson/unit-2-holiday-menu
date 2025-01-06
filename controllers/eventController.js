const Event = require('../models/event');

// router.get('/', eventController.getEvents);
exports.getEvents = async (req, res) => {
    try {
        const usersEvents = await Event.find();
        const events = usersEvents.map(event => {
            return {
                id: event._id,
                name: event.name,
                date: event.date.toDateString(),
                host: event.user,
            };
        });
        res.render('events/index', { events });
    } catch (err) {
        res.status(500).send('Error getting events.');
    }
};

// router.get('/new', ensureAuthenticated, eventController.newEventForm);
exports.newEventForm = (req, res) => {
    res.render('events/new');
};

// router.post('/', ensureAuthenticated, eventController.createEvent);
exports.createEvent = async (req, res) => {
    try {
        const { eventName, eventDate, eventType, eventLocation } = req.body;
        const event = new Event({ name: eventName, date: eventDate, eventType, location: eventLocation, user: req.user._id });
        await event.save();
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error creating event.');
    }
};

// route.get('/:id/invite', ensureAuthenticated, eventController.inviteForm);
exports.inviteToEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    const user = await User.find();
    res.render('events/invite', { event, contacts: user.contacts });
};

// router.get('/:id/join', ensureAuthenticated, eventController.attendEvent);
exports.attendEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.guests.push(req.user._id);
        await event.save();
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error attending event.');
    }
};

// router.get('/:id/leave', ensureAuthenticated, eventController.unattendEvent);
exports.unattendEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.guests = event.guests.filter(guest => guest.toString() !== req.user._id.toString());
        await event.save();
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error unattending event.');
    }
}

// router.get('/:id/edit', ensureAuthenticated, eventController.editEventForm);
exports.editEventForm = async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.render('events/edit', { event });
};

// router.put('/:id', ensureAuthenticated, eventController.updateEvent);
exports.updateEvent = async (req, res) => {
    try {
        const { name, date } = req.body;
        await Event.findByIdAndUpdate(req.params.id, { name, date });
        res.redirect('/events');
    }
    catch (err) {
        res.status(500).send('Error updating event.');
    }
}

// router.delete('/:id', ensureAuthenticated, eventController.deleteEvent);
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error deleting event.');
    }
};
