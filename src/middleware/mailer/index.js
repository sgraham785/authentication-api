import path from 'path'
import emailTemplates from 'email-templates'
import {} from 'dotenv/config'
import { transporter } from '../../configurations/mailer'
const templatesDir = path.resolve(__dirname, '..', 'public/views/mail')

console.log(process.env)

export default (name, data, fn) => {
  // make sure that we have an user email
  if (!data.email || !data.subject) {
    return fn(new Error('email address required'))
  }
  // TODO: use OY email template engine
  emailTemplates(templatesDir, (err, template) => {
    if (err) {
      console.log(err)
      return fn(err)
    }
    // Send a single email
    template(name, data, (err, html, text) => {
      if (err) {
        console.log(err)
        return fn(err)
      }
      // if we are testing don't send out an email instead return
      // success and the html and txt strings for inspection
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        console.log(`Email Sent! :: ${html}`)
        fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text)
        return
      }

      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: data.subject,
        html,
        // generateTextFromHTML: true,
        text
      }, (err, responseStatus) => {
        if (err) {
          return fn(err)
        }
        return fn(null, responseStatus.message, html, text)
      })
    })
  })
}
