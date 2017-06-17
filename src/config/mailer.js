import 'dotenv/config'
import nodemailer from 'nodemailer'

// create reusable transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
