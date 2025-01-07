const Event = require('../models/event');

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

exports.newEventForm = (req, res) => {
    res.render('events/new');
};

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

exports.inviteToEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    const user = await User.find();
    res.render('events/invite', { event, contacts: user.contacts });
};

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

exports.editEventForm = async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.render('events/edit', { event });
};

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

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error deleting event.');
    }
};
