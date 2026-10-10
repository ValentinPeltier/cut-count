import { Translations } from '@/lib'
import Link from 'next/link'
import { ReactNode } from 'react'

type CustomRichParams = {
  [key: string]: ((children: ReactNode) => ReactNode) | ReactNode | string | number | undefined
}

export const customRich = (t: Translations, key: string, params: CustomRichParams = {}) => {
  return t.rich(key, {
    error: (children) => <span className="error">{children}</span>,
    b: (children) => <span className="bold">{children}</span>,
    i: (children) => <span className="italic">{children}</span>,
    br: () => <br />,
    underline: (children) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
    green: (children) => <span className="font-inherit green-ghgp">{children}</span>,
    purple: (children) => <span className="font-inherit purple-ghgp">{children}</span>,
    white: (children) => <span style={{ color: 'white !important', fontSize: 'font-inherit' }}>{children}</span>,
    ul: (children) => <ul>{children}</ul>,
    li: (children) => <li>{children}</li>,
    faqLink: (children) => (
      <Link
        href={process.env.NEXT_PUBLIC_FAQ_LINK ?? ''}
        target="_blank"
        rel="noreferrer noopener"
        className="font-inherit"
      >
        {children}
      </Link>
    ),
    supportLink: (children) => (
      <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="font-inherit">
        {children}
      </Link>
    ),
    abcLink: (children) => (
      <Link
        href={process.env.NEXT_PUBLIC_ABC_SITE ?? ''}
        target="_blank"
        rel="noreferrer noopener"
        className="font-inherit"
      >
        {children}
      </Link>
    ),
    ...params,
  })
}
