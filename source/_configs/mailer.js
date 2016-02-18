var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');

var dotenv = require('dotenv');
var envFile = path.join(__dirname, '..', '.env');

// load up .env file
if (fs.existsSync(envFile)){
    dotenv.load();
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Reusable transporter connection header;
module.exports.transporter = transporter;