const express = require('express');
const route = express.Router();
const emailController = require('../controllers/emailController');
const smsController = require('../controllers/smsController');


route.post('/send-email', emailController.sendEmail);
route.post('/send-sms-otp', smsController.sendSMS);
route.post('/send-mail-otp', emailController.sendOTPmail);

module.exports = route;