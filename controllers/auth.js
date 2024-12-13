const User = require('../models/user');
const passport = require('passport');

exports.registerForm = (req, res) => {
  res.render('users/register');
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

exports.login =  (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      console.error('Authentication failed:', info);
      req.flash('error', info.message || 'Invalid credentials.');
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return next(err);
      }
      res.redirect('/items');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/'));
};
