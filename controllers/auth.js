const User = require('../models/user');
const passport = require('passport');

exports.registerForm = (req, res) => {
  res.render('account/register');
};

exports.register = async (req, res) => {
  const { password, firstName, lastName, email, dietaryAccommodations } = req.body;

  try {
    const user = new User({  
      firstName, 
      lastName, 
      email, 
      dietaryAccommodations 
    });
    user.email = email.toLowerCase();

    await User.register(user, password);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'An error occurred during registration.');
    res.redirect('/register');
  }
};

exports.loginForm = (req, res) => {
  res.redirect('/');
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
      res.redirect('/items');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/'));
};
