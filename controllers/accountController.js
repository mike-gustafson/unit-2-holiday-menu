const User = require('../models/user');

// router.get('/', accountController.accountHome);
exports.accountHome = async (req, res) => {
  res.render('account/index', { user: req.user });
};

exports.accountProfile = async (req, res) => {
  res.render('account/profile', { user: req.user });
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
  if ((req.user.id === req.params.id) && req.user.email === req.body.email) {
    console.log('information correct')
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      user.remove();
      req.logout();
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error deleting account.');
    }
  } else {
    res.status(403).redirect('/account/profile');
  }
};
