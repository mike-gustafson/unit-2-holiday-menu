const user = require('../../models/user');
const User = require('../../models/user');


const fetchAllEvents = async (user) => {
    const events = user.allEvents;
    for (const event of events) {
        event.host = await User.findById(event.host);
        event.host = event.host.fullName;
    };
    return events;
};

module.exports = fetchAllEvents;