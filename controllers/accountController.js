const User = require('../models/user');

exports.accountHome = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate('dishes');
    res.render('account/index', { user });
  }
  catch (err) {
    console.error('Error getting user:', err);
    return res.status(500).send('Error getting user.');
  }
};

exports.accountProfile = (req, res) => {
  res.render('account/profile', { user: req.user });
};

exports.accountConnections = (req, res) => {
  res.render('account/connections', { user: req.user });
};

exports.newAccountForm = (req, res) => {
  res.render('account/register');
};

exports.editAccountForm = (req, res) => {
  res.render('account/edit', { user: req.user });
};

exports.deleteAccountConfirm = (req, res) => {
  res.render('account/deleteConfirm', { user: req.user });
};

exports.deleteAccount = async (req, res) => {
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
