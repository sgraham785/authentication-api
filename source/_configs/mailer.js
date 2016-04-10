require('dotenv').config()
var nodemailer = require('nodemailer')

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Reusable transporter connection header
module.exports.transporter = transporter
