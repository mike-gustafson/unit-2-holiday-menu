const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    description: { type: String},
    guests: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        name: { type: String },
        dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
        status: { type: String, enum: ['Attending', 'Not Attending', 'Maybe', 'Invited'], default: 'Invited' },
    }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },
    capacity: { type: Number, default: 0 }, // 0 means unlimited
}, { timestamps: true });

    eventSchema.pre(['find', 'findOne'], function() {
        this.populate('host').populate('guests.userId').populate('guests.dish');
    });

    eventSchema.virtual('formattedDate').get(function () {
        return this.date
            ? this.date.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })
            : 'N/A';
    });
    
    eventSchema.virtual('formattedTime').get(function () {
        return this.date
            ? this.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : 'N/A';
    });
    
    eventSchema.virtual('monthName').get(function () {
        return this.date
            ? this.date.toLocaleDateString('en-US', { month: 'short' })
            : 'N/A';
    });
    

    eventSchema.virtual('hostName').get(function() {
        return this.host ? this.host.fullName : 'Unknown Host';
    });
    
    eventSchema.virtual('guestList').get(function() {
        return this.guests && this.guests.length > 0
            ? this.guests.map(guest => guest.name).join(', ') : 'No Guests';
    });
    
    eventSchema.virtual('guestCount').get(function() {
        return this.guests.length;
    });

    eventSchema.virtual('isPast').get(function() {
        return this.date && new Date() > new Date(this.date.toISOString().split('T')[0] + 'T' + this.time);
    });

    eventSchema.virtual('isFull').get(function () {
        return this.capacity > 0 && this.guests.length >= this.capacity;
    });
    
    eventSchema.index({ date: 1 });
    eventSchema.index({ host: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);