import ejs from 'ejs'
import fs from 'fs'
import { getTranslations } from 'next-intl/server'
import path from 'path'
import { getTransporter } from './transposter'

const TEMPLATE_ENV = 'CUT'

const getHtml = async ({ file, data }: { file: string; data?: ejs.Data }) => {
  const basePath = path.join(process.cwd(), 'src', 'lib', 'services', 'email', 'views')
  const customPath = path.join(basePath, TEMPLATE_ENV, `${file}.ejs`)
  const fallbackPath = path.join(basePath, 'common', `${file}.ejs`)
  const templatePath = fs.existsSync(customPath) ? customPath : fallbackPath
  return ejs.renderFile(templatePath, data)
}

export const sendEmail = async (
  to: string[],
  subject: string,
  template: string,
  templateData: Record<string, unknown>,
) => {
  if (to.length === 0) {
    throw new Error('No recipient')
  }

  const faq = process.env.NEXT_PUBLIC_FAQ_LINK ?? ''
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''
  const from = process.env.MAIL_USER

  const t = await getTranslations('email.body')

  const data = {
    ...templateData,
    faq,
    support,
    t_hello: t('hello'),
    t_thisLink: t('thisLink'),
    t_goodDay: t('goodDay'),
    t_regards: t('regards'),
    t_team: t('team'),
    t_faqContent: t('faqContent'),
    t_faqLinkText: t('faqLinkText'),
    t_faqOrEmail: t('faqOrEmail'),
  }

  const transporter = await getTransporter()
  const html = await getHtml({ file: template, data })
  return transporter.sendMail({
    to: to.join(','),
    from,
    subject,
    html,
    text: html.replace(/<(?:.|\n)*?>/gm, ''),
    headers: {
      'X-Mailjet-TrackOpen': '0',
      'X-Mailjet-TrackClick': '0',
    },
  })
}
