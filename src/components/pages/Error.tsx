'use client'

import Block from '@/lib/components/base/Block'
import { customRich } from '@/lib/utils/customRich'
import { getClientEnvVar } from '@/lib/clientEnv'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const Error = () => {
  const support = getClientEnvVar('SUPPORT_EMAIL')

  const t = useTranslations('error')
  return (
    <Block title={t('error')} as="h1">
      {customRich(t, 'contactSupport', {
        p: (children) => <p>{children}</p>,
        link: (children) => <Link href="/">{children}</Link>,
        m: () => <Link href={`mailto:${support}`}>{support}</Link>,
        logout: (children) => <Link href="/logout">{children}</Link>,
      })}
    </Block>
  )
}

export default Error
