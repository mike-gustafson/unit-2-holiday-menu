const nodemailer = require('nodemailer');

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;