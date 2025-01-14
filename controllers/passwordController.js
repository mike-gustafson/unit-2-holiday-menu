const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const resetEmail = fs.readFileSync(path.join(__dirname, '../views/email/reset.html'), 'utf8');

exports.requestForm = async (req, res) => {
    res.render('layout', {
        title: 'Reset Password',
        cssFile: 'account.css',
        view: 'account/passwordReset',
    });
}

exports.resetForm = (req, res) => {
    res.render('layout', {
        title: 'Reset Password',
        cssFile: 'account.css',
        view: 'account/password/reset', 
        token: req.params.token })
}

exports.createResetToken = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid E-Mail.');
            return res.redirect('/password');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
        const resetURL = `http://localhost:${process.env.PORT}/password/${resetToken}`
        const html = resetEmail.replace(/<%= resetLink %>/g, resetURL)
        const mailOptions = {
            from: `"CrownCater" crowd-cater@gmail.com`,
            to: email,
            subject: 'Password Reset Request',
            html: html,
        }
        await transporter.sendMail(mailOptions)
        res.render('layout', {
            title: 'Password Reset Sent',
            cssFile: 'account.css',
            view: 'account/passwordResetSent',
        })
    } catch (err) {
        console.error('error during reset:', err)
        res.status(500).send('error processing request')
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = await bcrypt.hash(token, 10);
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) { return res.status(400).send('Invalid or expired token') }
        const isValidToken = await bcrypt.compare(hashedToken, user.resetPasswordToken);
        if (!isValidToken) { return res.status(400).send('Invalid token') }
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        req.logIn(user, (err) => {
          if (err) { return next(err) }
          res.redirect('/account');
        });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).send('Error processing request');
    }
}