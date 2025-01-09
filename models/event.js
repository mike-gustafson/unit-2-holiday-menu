const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String},
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    });


    eventSchema.virtual('formattedDate').get(function() {
        return this.date.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });
    });

    eventSchema.virtual('formattedTime').get(function() {
        return this.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    eventSchema.virtual('monthName').get(function() {
        return this.date.toLocaleDateString('en-US', { month: 'short' });
    });

    eventSchema.virtual('hostName').get(function() {
        return this.user.fullName;
    });

module.exports = mongoose.model('Event', eventSchema);