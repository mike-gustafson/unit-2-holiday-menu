const e = require('connect-flash');
const Event = require('../models/event');
const User = require('../models/user');

exports.getEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('eventsHosting')
            .populate('eventsAttending')
        res.render('layout', { 
            events: user.allEvents,
            title: 'Events',
            cssFile: 'events.css',
            view: 'events/index'});
    } catch (err) {
        res.status(500).send('Error getting events.');
    }
};

exports.newEventForm = (req, res) => {
    res.render('layout', { 
        title: 'New Event', 
        cssFile: 'events.css', 
        view: 'events/new' });
};

exports.createEvent = async (req, res) => {
    try {
        const newEvent = req.body;
        newEvent.date = new Date(`${newEvent.date}T${newEvent.time}`);
        const event = new Event(newEvent);
        event.user = req.user.id;
        event.guests.push(req.user.id);
        const user = await User.findById(req.user.id);
        user.eventsHosting.push(event._id);
        user.eventsAttending.push(event._id);
        await user.save();
        await event.save();
        res.redirect('/events');
    } catch (err) {
        res.status(500).send('Error creating event.');
    }
};

exports.showEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('user')
            .populate('guests')
            .populate('dishes');
        res.render('layout', { 
            event,
            title: event.name,
            cssFile: 'events.css',
            view: 'events/show'
         });
    } catch (err) {
        res.status(500).send('Error showing event.');
    }
}

exports.inviteToEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    const user = await User.find();
    res.render('layout', { 
        event, 
        contacts: user.connections,
        title: 'Invite to Event',
        cssFile: 'events.css',
        view: 'events/invite'
    });
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
    res.render('layout', { 
        event,
        title: 'Edit Event',
        cssFile: 'events.css',
        view: 'events/edit'        
    });
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
