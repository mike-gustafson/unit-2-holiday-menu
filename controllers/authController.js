const User = require('../models/user');
const passport = require('passport');

exports.register = async (req, res) => {
  try {
    const user = new User({  
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
      email: req.body.email.toLowerCase(), 
      dietaryAccommodations: req.body.dietaryAccommodations
    });
    await User.register(user, req.body.password);
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'An error occurred during registration.');
    res.redirect('account/register');
  }
};

exports.login =  (req, res, next) => { 
  req.body.email = req.body.email.toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Invalid credentials.');
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/account');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/'));
};
