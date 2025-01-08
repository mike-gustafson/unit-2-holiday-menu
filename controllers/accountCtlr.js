const User = require('../models/user');

exports.home = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate('dishes')
    .populate('favoriteDishes')
    .populate('eventsHosting')
    .populate('eventsAttending');
    res.render('account/index', { user });
  }
  catch (err) {
    console.error('Error getting user:', err);
    res.redirect('/');
  }
};

exports.newForm = (req, res) => {
  res.render('account/register');
};

exports.editForm = (req, res) => {
  res.render('account/edit');
};

exports.deleteConfirm = (req, res) => {
  res.render('account/deleteConfirm');
};

exports.profile = (req, res) => {
  res.render('account/profile');
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