const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the email
  const mailOptions = {
    from: 'Dalius Slavickas <slavickasd@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
