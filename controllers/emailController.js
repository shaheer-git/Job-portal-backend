const nodemailer = require('nodemailer');
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
const emailController = {
  sendEmail: (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASS
      }
    });
    const mailOptions = {
      from: process.env.EMAILID,
      to: process.env.EMAILSENTTO,
      subject: req.body.subject ? req.body.subject : "General Inquiry",
      text: `
      Name: ${req.body.name}.
      Phone number: ${req.body.phoneNumber}.
      Message: ${req.body.message}.
      Location: ${req.body.location}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Email sent successfully' });
      }
    });
  },
  sendOTPmail: (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASS
      }
    });
    const OTP = generateOTP();
    const encryptedOTP = Buffer.from(OTP, 'base64').toString('binary');
    const mailOptions = {
      from: process.env.EMAILID,
      to: req.body.emailId,
      subject: "One Call verification code",
      text: `Dear Customer, ${OTP} is Your (One Time Password)OTP to validate your login. Do not share it with anyone`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ status: "success", message: 'Email sent successfully', res: encryptedOTP });
      }
    });
  }
};

module.exports = emailController;
