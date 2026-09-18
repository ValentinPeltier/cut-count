import { getEnvVar } from '@/lib/environment'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

let transporter: nodemailer.Transporter | undefined

export const getTransporter = async () => {
  if (transporter) {
    return transporter
  }

  const host = await getEnvVar('MAIL_HOST')
  const port = await getEnvVar('MAIL_PORT')
  const user = await getEnvVar('MAIL_USER')
  const pass = await getEnvVar('MAIL_PASSWORD')

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    auth: {
      user,
      pass,
    },
  } as SMTPTransport.Options)

  return transporter
}
