const Event = require('../models/event');

// router.get('/', eventController.getEvents);
exports.getEvents = async (req, res) => {
    const events = await Event.find();
    res.render('events/index', { events });
};

// router.get('/new', ensureAuthenticated, eventController.newEventForm);
exports.newEventForm = (req, res) => {
    res.render('events/new');
};

// router.post('/', ensureAuthenticated, eventController.createEvent);
exports.createEvent = async (req, res) => {
    try {
        const { name, date } = req.body;
        const event = new Event({ name, date });
        await event.save();
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error creating event.');
    }
};

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
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/events');
};
