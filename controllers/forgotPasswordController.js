const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');


// router.get('/', forgotPasswordcontroller.forgotPasswordForm);
exports.forgotPasswordForm = async (req, res) => {
    res.render('resetPassword/forgotForm')
}

// router.post('/', forgotPasswordcontroller.forgotPassword);
exports.forgotPassword = async (req, res) => {
    const email = req.body.email.toLowerCase()
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Email not found.')
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const resetURL = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`
        const mailOptions = {
            from: `"CrownCater" crowd-cater@gmail.com`,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset.</p>
                <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
                <p>This link is valid for 1 hour.</p>`,
        }

        await transporter.sendMail(mailOptions)

        res.send('An email has been send')

    } catch (err) {
        console.error('error during reset:', err)
        res.status(500).send('error processing request')
    }
}


// router.get('/reset/:token', forgotPasswordcontroller.resetPasswordForm);
exports.resetPasswordForm = (req, res) => {
    res.redirect('resetPassword/resetPassword', { token: req.params.token })
}

// router.post('/reset/:token', forgotPasswordcontroller.resetPassword);
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: { $exists: true },
            tokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        const isValidToken = await bcrypt.compare(token, user.resetToken);
        if (!isValidToken) {
            return res.status(400).send('Invalid token');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        user.resetToken = undefined;
        user.tokenExpiry = undefined;

        await user.save();

        res.send('Password reset successful');
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).send('Error processing request');
    }
}
