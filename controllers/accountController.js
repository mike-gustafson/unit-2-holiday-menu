const User = require('../models/user');

const diets = require('../utils/data/diets');

const cssFile = 'account.css';

const fetchAllEvents = require('../utils/middleware/fetchAllEvents');
const fetchFriendsDishes = require('../utils/middleware/fetchFriendsDishes');
const fetchUserWithPopulates = require('../utils/middleware/fetchUserWithPopulates');
const fetchFavoriteDishes = require('../utils/middleware/fetchFavoriteDishes');

exports.home = async (req, res) => {
  try {
    const populateArray = ['dishes', 'eventsHosting', 'eventsAttending', 'connections'];
    const user = await fetchUserWithPopulates(req.user.id, populateArray);
    const favoriteDishes = await fetchFavoriteDishes(user);
    const friendsDishes = await fetchFriendsDishes(user);
    const events = await fetchAllEvents(user);
    res.render('layout', {
      user,
      events,
      userDishes: user.dishes,
      favoriteDishes,
      friendsDishes,
      title: 'Home',
      cssFile: 'account.css',
      view: 'account/index'});
  }
  catch (err) {
    console.error('Error getting user:', err);
    res.redirect('/');
  }
};

exports.editForm = async (req, res) => {
  const populates = ['dishes', 'favoriteDishes', 'eventsHosting', 'eventsAttending'];
  const user = fetchUserWithPopulates(req.user.id, populates);
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
  const populates = ['dishes', 'favoriteDishes', 'eventsHosting', 'eventsAttending', 'connections'];
  const user = await fetchUserWithPopulates(req.user.id, populates);
  const favoriteDishes = await fetchFavoriteDishes(user);
  const friendsDishes = await fetchFriendsDishes(user);
  res.render('layout', { 
    user,
    userDishes: user.dishes,
    favoriteDishes,
    friendsDishes,
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
    const user = await User.findById(req.user._id, { favoriteDishes: 1 });
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