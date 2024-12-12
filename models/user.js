const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  dietaryAccommodations: [String],
});

// Add passport-local-mongoose plugin for password management
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
