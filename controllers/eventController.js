const Event = require('../models/event');
const User = require('../models/user');
const Dish = require('../models/dish');

const fetchUserWithPopulates = require('../utils/middleware/fetchUserWithPopulates');

exports.getEvents = async (req, res) => {
    try {
        const dataToPopulate = ['eventsHosting', 'eventsAttending'];
        const user = await fetchUserWithPopulates(req.user.id, dataToPopulate);
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
        if (!event) { res.redirect('/events') }
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
            console.log('no dish')
            userEventDetails.dish = { name: 'No dish selected' };
        }
        const dataToPopulate = ['dishes', 'favoriteDishes', 'connections'];
        const user = await fetchUserWithPopulates(req.user.id, dataToPopulate);
        let dishes = Array.from(
            new Map(
                [...user.dishes, ...user.favoriteDishes].map(dish => [dish._id.toString(), dish])
            ).values()
        );
        dishes = await Dish.populate(dishes, { path: 'user', select: '_id firstName lastName' });
        
        let invitableUsers = []
        const isUsersEvent = (event, userId) => {
            const isTrue = (event.host.id.toString() === userId);
            if (isTrue) { 
                invitableUsers = user.connections;
                invitableUsers = invitableUsers.filter(user => {
                    return !event.guests.some(guest => guest.userId.id.toString() === user.id);
                })
                return 'partials/_inviteUsers'; }
            return '../partials/_blank';
        }
        const rightSidebar = isUsersEvent(event, req.user.id);
        
        console.log(invitableUsers)
        res.render('layout', {
            event,
            userEventDetails,
            invitableUsers,
            user,
            dishes,
            rightSidebar,
            title: event.name,
            cssFile: 'events.css',
            view: 'events/show'
        });
    } catch (err) {
        console.error('Error showing event:', err);
        res.status(500).send('Error showing event.');
    }
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

exports.inviteUser = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        const user = await User.findById(req.params.userId);
        if (!event || !user) {
            return res.status(404).send('Event or user not found.');
        }
        const isInvited = event.guests.some(guest => {
            return guest.userId.id.toString() === user.id;
        });
        if (isInvited) {
            return res.status(400).send('User already invited.');
        }
        event.guests.push({
            userId: user.id,
            name: user.fullName,
            status: 'Invited',
        });
        await event.save();
        user.eventsAttending.push(event._id);
        await user.save();
        res.redirect('/events/' + req.params.eventId);
    }
    catch (err) {
        res.status(500).send('Error inviting user.');
    }
}

exports.uninviteUser = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        console.log(event)
        console.log(req.params.userId)
        const user = await User.findById(req.params.userId);
        console.log(user)
        if (!event || !user) {
            return res.status(404).send('Event or user not found.');
        }
        event.guests = event.guests.filter(guest => {
            return guest.userId.id.toString() !== user.id;
        });
        await event.save();
        user.eventsAttending = user.eventsAttending.filter(eventId => {
            return eventId.toString() !== event.id;
        });
        await user.save();
        res.redirect('/events/' + req.params.eventId);
    }
    catch (err) {
        res.status(500).send('Error uninviting user.');
    }
}