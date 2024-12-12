const User = require('../models/user');
const passport = require('passport');

exports.registerForm = (req, res) => {
  res.render('users/register');
};

exports.register = async (req, res) => {
  const { username, password, firstname, lastname, email, dietaryAccommodations } = req.body;

  try {
    const user = new User({ 
      username, 
      firstname, 
      lastname, 
      email, 
      dietaryAccommodations 
    });

    await User.register(user, password);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'An error occurred during registration.');
    res.redirect('/register');
  }
};

exports.loginForm = (req, res) => {
  res.render('users/login');
};

exports.login = passport.authenticate('local', {
  successRedirect: '/items',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/login'));
};
