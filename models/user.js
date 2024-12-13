const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  dietaryAccommodations: [String],
});

// Add passport-local-mongoose plugin for password management
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});
 

module.exports = mongoose.model('User', userSchema);
