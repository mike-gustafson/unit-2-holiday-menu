const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const dishSchema = require('./dish');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address'] 
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dietaryAccommodations: { type: [String] },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
  favoriteDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  eventsHosting: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
