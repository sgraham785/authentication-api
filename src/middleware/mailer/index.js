import { } from 'dotenv'
import React from 'react'
import Oy from 'oy-vey'
import { transporter } from '../../config/nodemailer'
import VerificationEmail from '../../views/email/templates/verification'
export default (name, data, fn) => {
  if (!data.email || !data.subject) return fn(new Error('email address required'))

  const html = Oy.renderTemplate(<VerificationEmail link={data.link} />, {
    title: 'This is an example',
    previewText: 'This is an example',
    bgColor: '#f7f7f7'
  })

  const text = data.link
      // if we are testing don't send out an email instead return
      // success and the html and txt strings for inspection
  if (process.env.NODE_ENV === 'development') {
    console.log(`Email Sent! :: ${text}`)
    return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text)
  }

  transporter.sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: data.subject,
      html,
          // generateTextFromHTML: true,
      text
    },
    (err, responseStatus) => {
      if (err) {
        return fn(err)
      }
      return fn(null, responseStatus.message, html, text)
    }
  )
}
