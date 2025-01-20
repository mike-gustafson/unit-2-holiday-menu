const user = require('../../models/user');
const User = require('../../models/user');


const fetchAllEvents = async (user) => {
    const events = user.allEvents;
    for (const event of events) {
        event.host = await User.findById(event.host);
        event.guests = await User.find({ _id: { $in: event.guests } });
    };
    return events;
};

module.exports = fetchAllEvents;