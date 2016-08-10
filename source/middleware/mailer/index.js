var fs = require('fs')
var path = require('path')

var transporter = require('../../configurations/mailer').transporter
var templatesDir = path.resolve(__dirname, '..', 'public/views/mail')
var emailTemplates = require('email-templates')

var dotenv = require('dotenv')
var envFile = path.join(__dirname, '..', '.env')

// load up .env file
if (fs.existsSync(envFile)) {
  dotenv.load()
}

var EmailAddressRequiredError = new Error('email address required')

var sendOne = function (templateName, locals, fn) {
  // make sure that we have an user email
  if (!locals.email) {
    return fn(EmailAddressRequiredError)
  }
  // make sure that we have a message
  if (!locals.subject) {
    return fn(EmailAddressRequiredError)
  }
  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      console.log(err)
      return fn(err)
    }
    // Send a single email
    template(templateName, locals, function (err, html, text) {
      if (err) {
        console.log(err)
        return fn(err)
      }
      // if we are testing don't send out an email instead return
      // success and the html and txt strings for inspection
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        console.log('Email Sent! :: ' + html)
        fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text)
        return
      }

      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: locals.email,
        subject: locals.subject,
        html: html,
        // generateTextFromHTML: true,
        text: text
      }, function (err, responseStatus) {
        if (err) {
          return fn(err)
        }
        return fn(null, responseStatus.message, html, text)
      })
    })
  })
}

module.exports.sendOne = sendOne
