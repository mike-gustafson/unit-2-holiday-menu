const Event = require('../models/event');
const User = require('../models/user');
const Dish = require('../models/dish');

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

exports.createEvent = async (req, res) => {
    try {
        const { name, date, time, location, description, capacity, status } = req.body;
        const newEvent = {
            name,
            date: new Date(`${date}T${time}`),
            time,
            location: {
                address: location.address,
                city: location.city,
                state: location.state,
                zipCode: location.zipCode,
                latitude: location.latitude || null,
                longitude: location.longitude || null,
            },
            description,
            capacity: capacity || 0,
            status: status || 'Upcoming',
            host: req.user.id,
            guests: [
                {
                    userId: req.user.id,
                    name: req.user.fullName,
                    dish: req.user.dish || null,
                    status: 'Attending',
                },
            ],
        };
        const event = new Event(newEvent);
        await event.save();
        const user = await User.findById(req.user.id);
        user.eventsHosting.push(event._id);
        user.eventsAttending.push(event._id);
        await user.save();
        res.redirect('/account');
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).send('Error creating event.');
    }
};

exports.showEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).send('Event not found.');
        }
        const isInvited = event.guests.some(guest => {
            return guest.userId.id.toString() === req.user.id;
        });
        if (!isInvited) {
            return res.status(401).send('You are not invited to this event.');
        }
        const userEventDetails = event.guests.find(guest => {
                return guest.userId.id.toString() === req.user._id.toString();
        });
        if (userEventDetails.dish === null) {
            userEventDetails.dish = { name: 'No dish selected' };
        }
        const user =  await User.findById(req.user.id)
            .populate('favoriteDishes')
            .populate('dishes');
        let dishes = Array.from(
            new Map(
                [...user.dishes, ...user.favoriteDishes].map(dish => [dish._id.toString(), dish])
            ).values()
        );
        dishes = await Dish.populate(dishes, { path: 'user', select: '_id firstName lastName' });
        console.log(dishes);
        res.render('layout', {
            event,
            userEventDetails,
            dishes,
            title: event.name,
            cssFile: 'events.css',
            view: 'events/show'
        });
    } catch (err) {
        console.error('Error showing event:', err);
        res.status(500).send('Error showing event.');
    }
};


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
        const updatedEvent = req.body;
        await Event.findByIdAndUpdate(req.params.id, updatedEvent);
        res.redirect('/events/' + req.params.id);
    }
    catch (err) {
        res.status(500).send('Error updating event.');
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/account');
    } catch (err) {
        res.status(500).send('Error deleting event.');
    }
};

exports.rsvp = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found.');
        };
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        const guest = event.guests.find(guest => guest.userId._id.toString() === req.user.id);
        if (!guest) {
            return res.status(404).send('Guest not found.');
        }
        guest.status = req.body.status;
        const updatedDish = await Dish.findById(req.body.dish);
        guest.dish = updatedDish._id;
        await event.save();
        res.redirect('/events/' + req.params.id);
    } catch (err) {
        res.status(500).send('Error updating RSVP.');
    }
}