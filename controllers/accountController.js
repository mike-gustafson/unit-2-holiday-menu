const event = require('../models/event');
const User = require('../models/user');

exports.home = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/');
    }
    const userId = req.user.id;
    const user = await User.findById(userId)
    .populate('dishes')
    .populate('favoriteDishes')
    .populate('eventsHosting')
    .populate('eventsAttending');
    const events = user.allEvents;
    for (const event of events) {
      event.host = await User.findById(event.host);
      event.host = event.host.fullName;
    };
    res.render('layout', {
      user: user,
      events: events,
    title: 'Home',
    cssFile: 'account.css',
    view: 'account/index'});
  }
  catch (err) {
    console.error('Error getting user:', err);
    res.redirect('/');
  }
};

exports.register = (req, res) => {
  res.render('layout', { 
    cssFile: 'account.css',
    title: 'Register',
    view: 'account/register'
  });
};

exports.editForm = (req, res) => {
  res.render('account/edit');
};

exports.deleteConfirm = (req, res) => {
  res.render('account/deleteConfirm');
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id)
  .populate('dishes')
  .populate('eventsAttending')
  .populate('eventsHosting')
  .populate('favoriteDishes');
  console.log(user);
  res.render('layout', { 
    cssFile: 'account.css',
    title: 'Profile',
    view: 'account/viewProfile'
  });
};

exports.connections = (req, res) => {
  res.render('account/connections');
};

exports.delete = async (req, res) => {
  req.body.email = req.body.email.toLowerCase();
  if ((req.user.id === req.params.id) && req.user.email === req.body.email) {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.logout((err) => {
        if (err) {
          console.error('Error during logout:', err);
          return res.status(500).send('Error during logout.');
        }
      })
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error deleting account.');
    }
  } else {
    res.status(403).redirect('/account/profile');
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate('dishes');
    const dishId = req.body.dishId;
    user.favoriteDishes.push(dishId);
    await user.save();
    res.redirect('/dishes/' + dishId);
  }
  catch (err) {
    console.error('Error adding favorite:', err);
    return res.status(500).send('Error adding favorite.');
  }
}

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const dishId = req.body.dishId;
    user.favoriteDishes = user.favoriteDishes.filter(id => id != dishId);
    await user.save();
    res.redirect('/dishes/' + dishId);
  }
  catch (err) {
    console.error('Error removing favorite:', err);
    return res.status(500).send('Error removing favorite.');
  }
}