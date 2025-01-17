const User = require('../models/user');
const diets = require('../utils/data/diets');

const cssFile = 'account.css';

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
    const userDishes = user.dishes;
    const favoriteDishes = user.favoriteDishes;
    const events = user.allEvents;
    for (const event of events) {
      event.host = await User.findById(event.host);
      event.host = event.host.fullName;
    };
    res.render('layout', {
      user,
      events,
      userDishes,
      favoriteDishes,
      title: 'Home',
      cssFile,
      view: 'account/index'});
  }
  catch (err) {
    console.error('Error getting user:', err);
    res.redirect('/');
  }
};

exports.editForm = async (req, res) => {
  const user = await User.findById(req.user.id)
  .populate('dishes')
  .populate('eventsAttending')
  .populate('eventsHosting')
  .populate('favoriteDishes');
  res.render('layout', { 
    diets,
    user,
    userDishes: user.dishes,
    favoriteDishes: user.favoriteDishes,
    cssFile,
    title: user.fullName,
    view: 'account/editProfile'
  });
};

exports.deleteConfirm = (req, res) => {
  res.render('layout', {
    title: 'Delete Account',
    cssFile,
    view: 'account/delete'
  });
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id)
  .populate('dishes')
  .populate('eventsAttending')
  .populate('eventsHosting')
  .populate('favoriteDishes');
  const userDishes = user.dishes;
  const favoriteDishes = user.favoriteDishes;
  res.render('layout', { 
    userDishes,
    favoriteDishes,
    cssFile,
    title: 'Profile',
    view: 'account/viewProfile'
  });
};

exports.connections = (req, res) => {
  res.render('layout', {
    title: 'Connections',
    cssFile,
    view: 'account/connections'
  });
};

exports.delete = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.logout((err) => {
        if (err) {
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
    req.user.favoriteDishes.push(req.body.dishId);
    await User.findByIdAndUpdate(req.user._id, req.user);
    res.redirect('/dishes/' + req.body.dishId);
  }
  catch (err) {
    return res.status(500).send('Error adding favorite.');
  }
}

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favoriteDishes = user.favoriteDishes.filter(id => id != req.body.dishId);
    await user.save();
    res.redirect('/dishes/' + req.body.dishId);
  }
  catch (err) {
    return res.status(500).send('Error removing favorite.');
  }
}

exports.update = async (req, res) => {
  try {
    const updatedUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      diet: req.body.diet,
    }
    await User.findByIdAndUpdate(req.user._id, updatedUser);
    res.redirect('/account/profile');
  }
  catch (err) {
    res.status(500).send('Error updating user.');
  }
}