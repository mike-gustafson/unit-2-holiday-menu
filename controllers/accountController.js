const User = require('../models/user');

// router.get('/', accountController.accountHome);
exports.accountHome = async (req, res) => {
  res.render('account/index', { user: req.user });
};

exports.accountProfile = async (req, res) => {
  res.render('account/profile', { user: req.user });
};

exports.accountConnections = async (req, res) => {
  res.render('account/connections', { user: req.user });
};

// router.get('/new', ensureAuthenticated, accountController.newAccountForm);
exports.newAccountForm = async (req, res) => {
  res.render('account/register');
};

// router.get('/:id/edit', ensureAuthenticated, accountController.editAccountForm);
exports.editAccountForm = async (req, res) => {
  res.render('account/edit', { user: req.user });
};

exports.deleteAccountConfirm = async (req, res) => {
  res.render('account/deleteConfirm', { user: req.user });
};

// router.delete('/:id', ensureAuthenticated, accountController.deleteAccount);
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
