const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const resetPasswordEmail = fs.readFileSync(
  path.join(__dirname, '../utils/emails/resetPasswordEmail.html'),
  'utf8'
);

async function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter.sendMail(mailOptions);
}

async function verifyEmailIsUnique(email) {
  const user = await User.findOne({ email });
  if (user) {
    req.flash('error', 'An account with that email already exists.');
    res.redirect('/signupForm');
  }
}

exports.signupForm = (req, res) => {
  res.render('layout', {
    cssFile: 'account.css',
    title: 'Sign up for CrowdCater',
    view: 'signup/index',
  });
};

exports.signup = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email.toLowerCase(),
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
    });
    await verifyEmailIsUnique(user.email);
    await User.register(user, req.body.password);
    req.flash('success', 'Registration successful! You can now log in.');
    res.redirect('/');
  } catch (err) {
    console.error('Signup error:', err);
    req.flash('error', 'Unable to register. Please try again.');
    res.redirect('/signupForm');
  }
};

exports.login = (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      req.flash('error', 'An error occurred during login.');
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Invalid credentials.');
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return next(err);
      }
      req.flash('success', `Welcome back, ${user.firstName}!`);
      res.redirect('/account');
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      req.flash('success', 'You have been logged out.');
      res.redirect('/');
    });
  });
};

exports.requestPasswordResetForm = (req, res) => {
  res.render('layout', {
    title: 'Reset Password',
    cssFile: 'account.css',
    view: 'passwordReset/index',
  });
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'No account found with that email.');
      return res.redirect('/password/reset');
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetURL = `http://localhost:${process.env.PORT}/password/reset/${resetToken}`;
    const html = resetPasswordEmail.replace(/<%= resetLink %>/g, resetURL);
    await sendEmail({
      from: `"CrowdCater" <crowd-cater@gmail.com>`,
      to: email,
      subject: 'Password Reset Request',
      html,
    });
    req.flash('success', 'Password reset email sent. Check your inbox.');
    res.redirect('/');
  } catch (err) {
    console.error('Error sending reset email:', err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/password/reset');
  }
};

exports.setNewPasswordForm = (req, res) => {
  res.render('layout', {
    title: 'Reset Password',
    cssFile: 'account.css',
    view: 'passwordReset/newPassword',
    token: req.params.token,
  });
};

exports.setNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken))) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/password/reset');
    }
    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    req.flash('success', 'Password successfully updated. Please log in.');
    res.redirect('/');
  } catch (err) {
    console.error('Error setting new password:', err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/password/reset');
  }
};