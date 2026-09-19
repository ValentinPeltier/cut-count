import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

let transporter: nodemailer.Transporter | undefined

export const getTransporter = async () => {
  if (transporter) {
    return transporter
  }

  const host = process.env.MAIL_HOST
  const port = process.env.MAIL_PORT
  const user = process.env.MAIL_USER
  const pass = process.env.MAIL_PASSWORD

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port ?? '', 10),
    auth: {
      user,
      pass,
    },
  } as SMTPTransport.Options)

  return transporter
}
